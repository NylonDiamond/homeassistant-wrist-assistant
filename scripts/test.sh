#!/bin/bash
#
# Run the integration's pytest suite and end with one summary line.
#
# Works from the main checkout or any worktree: the test venv lives only in
# the main checkout (.venv-test), so it is found through git's common dir.
# HA_URL and HA_TOKEN are unset because some tests read them and must never
# reach a real box. The cache provider is off so parallel runs in several
# worktrees do not fight over .pytest_cache.
#
# Usage:
#   scripts/test.sh                      whole suite
#   scripts/test.sh tests/test_foo.py    some files
#   scripts/test.sh tests -k delta       any pytest arguments
#   scripts/test.sh -v ...               full pytest output instead of the summary
#
# Last line is always:
#   RESULT: PASS|FAILED exit=N passed=N failed=N errors=N log=<path>

set -u

verbose=0
if [ "${1:-}" = "-v" ] || [ "${1:-}" = "--verbose" ]; then
    verbose=1
    shift
fi

root=$(git rev-parse --show-toplevel 2>/dev/null) || { echo "RESULT: FAILED exit=2 reason=not-in-git-repo"; exit 2; }
common=$(git rev-parse --path-format=absolute --git-common-dir 2>/dev/null)
main_root=$(dirname "$common")
py="$main_root/.venv-test/bin/python"
if [ ! -x "$py" ]; then
    echo "RESULT: FAILED exit=2 reason=no-venv ($py missing)"
    exit 2
fi

[ "$#" -eq 0 ] && set -- tests

log_dir="${TMPDIR:-/tmp}"
log_dir="${log_dir%/}/ha-int-tests"
mkdir -p "$log_dir"
log="$log_dir/$(basename "$root")-$(date +%Y%m%d-%H%M%S).log"

cd "$root" || exit 2
if [ "$verbose" -eq 1 ]; then
    env -u HA_URL -u HA_TOKEN "$py" -m pytest -q -p no:cacheprovider "$@" 2>&1 | tee "$log"
    code=${PIPESTATUS[0]}
else
    env -u HA_URL -u HA_TOKEN "$py" -m pytest -q -p no:cacheprovider -rfE "$@" >"$log" 2>&1
    code=$?
    # Failing and erroring test ids, then pytest's own summary line.
    grep -E '^(FAILED|ERROR) ' "$log" | head -40
    tail -1 "$log"
fi

summary=$(tail -1 "$log")
count() { echo "$summary" | grep -oE "[0-9]+ $1" | head -1 | grep -oE '^[0-9]+' || echo 0; }
passed=$(count passed)
failed=$(count failed)
errors=$(count 'errors?')

if [ "$code" -eq 0 ]; then state=PASS; else state=FAILED; fi
echo "RESULT: $state exit=$code passed=$passed failed=$failed errors=$errors log=$log"
exit "$code"
