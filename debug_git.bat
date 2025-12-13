@echo off
echo --- GIT STATUS --- > git_debug.log
git status >> git_debug.log 2>&1
echo. >> git_debug.log
echo --- GIT REMOTE --- >> git_debug.log
git remote -v >> git_debug.log 2>&1
echo. >> git_debug.log
echo --- GIT LOG --- >> git_debug.log
git log -1 >> git_debug.log 2>&1
