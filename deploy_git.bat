@echo off
git remote remove origin
git remote add origin https://github.com/rivkyriyantoro/Split-Billv1.git
git branch -M main
git push -u origin main
echo Done
