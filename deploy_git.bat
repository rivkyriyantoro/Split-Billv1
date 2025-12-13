@echo off
git remote remove origin
git remote add origin https://github.com/rivkyriyantoro/Split-Bill.git
git branch -M main
git push -u origin main
echo Done
