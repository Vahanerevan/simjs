If you want to make a patch from one commit (K1.6 -> K2.0), you can do it like this:

    git show 1990134b2d599a9c879d > ../joomla17.patch

Here is a tiny little helper that was used to convert various sub-projects from our prior svn trunk structure into git. 

https://github.com/fxstein/migration/blob/master/clone.sh

