git add .
git commit -a -m "comments: $1"
git push
ssh santosh@rackspace "cd /home/santosh/homebee/homebee-server-app;/home/santosh/homebee/homebee-server-app/pull-debug.sh"
