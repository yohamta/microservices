# CI
## on Pull Request
run test

## on Merge
- Did anything in the folder change?
  - the folders of each service -> build new image -> push to docker hub -> update deployment of the cluster
  - Infra -> apply all yaml files
