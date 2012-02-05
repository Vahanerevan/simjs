## High level git overview

Check out this high-level overview of git and how it is different from the likes of svn:

http://files.zend.com/help/Zend-Studio/git_and_github.htm

## Commands

If you want to make a patch from one commit (K1.6 -> K2.0), you can do it like this:

    git show 1990134b2d599a9c879d > ../joomla17.patch


## Scripts

Here is a tiny little helper that was used to convert various sub-projects from our prior svn trunk structure into git:

https://github.com/fxstein/migration/blob/master/clone.sh

