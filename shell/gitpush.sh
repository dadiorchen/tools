#!/bin/bash
#this script is to let git push more save, it:
#run test to pass all tests
#run eslint to pass all eslint
#then push
echo "Tests..."
npm test -- --watchAll=false
if [ $? -ne 0 ]; then
  echo "Test fail! Exit"
  exit
fi

echo "Eslint..."
eslint ./src/
if [ $? -ne 0 ]; then
  echo "Eslint fail! Exit"
  exit
fi

git status

echo "Git push..."

read -p "Sure to push (y/n)?" CONT
if [ "$CONT" = "y" ]; then
  echo "Pushing...";
  git push
  echo "DONE!"
else
  echo "Canceled";
fi
