#!/bin/bash

set -u

INPUT=$(cat)
declare -a TARGETS=()

is_supported_file() {
  [[ "$1" =~ \.(js|jsx|ts|tsx|vue)$ ]]
}

add_target() {
  local candidate="$1"
  if [[ -n "$candidate" && -f "$candidate" ]] && is_supported_file "$candidate"; then
    TARGETS+=("$candidate")
  fi
}

collect_git_targets() {
  local git_root
  if ! git_root=$(git rev-parse --show-toplevel 2>/dev/null); then
    return
  fi

  while IFS= read -r candidate; do
    add_target "$candidate"
  done < <(
    {
      git -C "$git_root" diff --name-only --diff-filter=ACMR
      git -C "$git_root" diff --cached --name-only --diff-filter=ACMR
      git -C "$git_root" ls-files --others --exclude-standard
    } | sed '/^$/d' | sort -u
  )
}

FILE_PATH=$(printf '%s' "$INPUT" | jq -r '.tool_input.file_path // empty' 2>/dev/null)
if [[ -n "$FILE_PATH" ]]; then
  add_target "$FILE_PATH"
else
  collect_git_targets
fi

if [[ ${#TARGETS[@]} -eq 0 ]]; then
  exit 0
fi

pnpm exec prettier --write "${TARGETS[@]}" >/dev/null 2>&1
pnpm exec eslint --fix "${TARGETS[@]}" >/dev/null 2>&1

TSC_OUTPUT=$(pnpm type-check 2>&1)
if printf '%s\n' "$TSC_OUTPUT" | grep -q "error TS"; then
  printf '%s\n' "$TSC_OUTPUT" | grep "error TS" | head -10 >&2
  exit 2
fi

exit 0
