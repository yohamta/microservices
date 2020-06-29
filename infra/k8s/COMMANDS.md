# k8s commands memo

## create service
```
$ k apply -f posts-srv.yaml
```

## create deployment
```
$ k apply -f posts-srv.yaml
```

## get pods
```
$ k get pods
NAME                          READY   STATUS    RESTARTS   AGE
posts-depl-76df47848b-lwrh6   1/1     Running   0          7m22s
```

## get services
```
$ k get services
NAME         TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
kubernetes   ClusterIP   10.96.0.1       <none>        443/TCP          5d21h
posts-srv    NodePort    10.109.111.44   <none>        4000:30000/TCP   4m3s
```

## get logs
```
$ k logs posts-depl-76df47848b-lwrh6

> posts@1.0.0 start /app
> nodemon index.js

[nodemon] 2.0.4
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node index.js`
v55
Listening on 4000
```

