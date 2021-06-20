# Net draft

## Repo

~~~shell
# get all repos
curl \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/users/vuejs/repos
  
# > [rawRepoInfo]
~~~

~~~shell
# get one repo's branch
curl \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/vuejs/vue/branches
  
# > [Branch] : {name,commit:{sha, url}}
~~~

~~~shell
# get sha to get files
curl \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/vuejs/vue/git/trees/0948d999f2fddf9f90991956493f976273c5da1f
  
# > [rawTree] : {sha,url,tree:[{rawFile}]}
# > rawFile: {path,type,sha,url} type is file or dict
~~~