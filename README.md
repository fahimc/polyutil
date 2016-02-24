#polyutil
This is an npm polymer util to build polymer components and release them.

When building polymer components you can encapsulate your project within itself which means your references to bower components can be internal rather than pointing out of the project folder. This is what is required when you release the component but it can be a pain to maintain when developing.

Polyutil will convert all the bower_component references to point outwards upon release.

##Component Setup
You will need two branches `master` and `release` in your repo. Your repo will need to be a git repo. 

##polyutil serve

This will create and launch a web server  

##polyutil release

This will merge your master branch with the release branch and convert all the bower_components references to point outward and push all the changes and finally create a new tag.

