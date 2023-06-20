### 7 多种Provider

- 这些自定义 provider 的方式里，最常用的是 useClass，不过我们一般会用简写，也就是直接指定 class。useClass 的方式由 IOC 容器负责实例化，我们也可以用 useValue、useFactory 直接指定对象。useExisting 只是用来起别名的，有的场景下会用到。

- 注入可通过构造器，也可通过属性

### 全局模块和生命周期