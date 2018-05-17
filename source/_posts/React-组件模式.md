---
title: React 组件模式
comments: true
date: 2018-05-16 00:33:40
tags:
from: https://levelup.gitconnected.com/react-component-patterns-ab1f09be2c82
---

使用 React 已经有一段时间了， React 是 Facebook 公司开发的用于构建网页界面的 UI 库。本文试图总结实践中所学到的一些模式，同时希望能够帮助到即将迈入组件世界的开发者。

<!-- more -->

### 概要

* 有状态组件 vs 无状态组件
* 容器组件 vs 展示组件
* 高阶组件 vs 回调渲染组件

![image](https://user-images.githubusercontent.com/15377484/40128970-a333542c-5965-11e8-8505-d1284d2759b1.png)

### 有状态组件 vs 无状态组件

正如 WEB 服务有静态和动态之分，React 组件也有有状态和无状态的区分。

* 有状态组件：在应用中组件可以拥有自身状态并操纵它；
* 无状态组件：只接收属性进行效果呈现。

一个简单的无状态组件，只受属性控制:

```jsx
const Button = props => (
  <button onClick={props.onClick}>
    {props.text}
  </button>
);
```

一个具有计数功能的按钮组件 (复用上面 Button 组件)

```jsx
class ButtonCounter extends React.Component {
  constructor() {
    super()
    this.state = {clicks: 0}
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick() {
    this.setState({clicks: this.state.clicks + 1})
  }

  render() {
    return (
      <Button
        onClick={this.handleClick}
        text={`You've clicked me ${this.state.clicks} times!`}
      />
    )
  }
}
```

正如上面两个 Demo 所示，第二个组件的 `constructor` 具有状态的定义，第一个组件只是单纯地渲染属性文字。有状态组件和无状态组件的划分看起来非常简单，但是它对于组件复用具有重大意义。

### 容器组件 vs 展示组件

当组件需要获取外部数据时，我们又可以将组件划分为两种新的类型。容器组件负责获取数据，它常常是超出了 React 范畴的，如使用 Redux 或 Relay 进行了绑定。对比而言，展示型组件不依赖于程序其他部分，它只和自身状态或属性有关。下面我们实现一个用户列表的展示组件:

```jsx
const UserList = props =>
  <ul>
    {props.users.map(u => (
      <li>{u.name} — {u.age} years old</li>
    ))}
  </ul>
```

容器组件可以用来更新用户列表的展示:

```jsx
class UserListContainer extends React.Component {
  constructor() {
    super()
    this.state = {users: [] }
  }

  componentDidMount() {
    fetchUsers(users => this.setState({ users }))
  }

  render() {
    return <UserList users={this.state.users} />
  }
}
```

这种分类将数据获取和渲染的逻辑分开，进而使用户列表组件可以复用。

如果你想了解更多该模式的信息，[这篇文章](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)对它进行了详细的解释。

### 高阶组件

当你想复用组件逻辑时，高阶组件非常有用。高阶组件：是将组件作为参数并返回新组件的 JS 函数。

假设你需要构建一个可扩展菜单组件，当用户点击时，它会显示隐藏子组件内容。因此，你可以使用高阶组件来实现:

```jsx
function makeToggleable(Clickable) {
  return class extends React.Component {
    constructor() {
      super()
      this.toggle = this.toggle.bind(this)
      this.state = {show: false}
    }

    toggle() {
      this.setState(prevState => ({ show: !prevState.show }))
    }

    render() {
      return (
        <div>
          <Clickable
            {...this.props}
            onClick={this.toggle}
          />
          {this.state.show && this.props.children}
        </div>
      )
    }
  }
}
```

这种方法允许我们使用 ES7 装饰器语法将逻辑应用于 ToggleableMenu 组件:

```jsx
@makeToggleable
class ToggleableMenu extends React.Component {
  render() {
    return (
      <div onClick={this.props.onClick}>
        <h1>{this.props.title}</h1>
      </div>
    )
  }
}
```

现在，我们可以将任何子组件传递给 ToggleableMenu 组件:

```jsx
class Menu extends React.Component {
  render() {
    return (
      <div>
        <ToggleableMenu title="First Menu">
          <p>Some content</p>
        </ToggleableMenu>
        <ToggleableMenu title="Second Menu">
          <p>Another content</p>
        </ToggleableMenu>
        <ToggleableMenu title="Third Menu">
          <p>More content</p>
        </ToggleableMenu>
      </div>
    )
  }
}
```

如果你熟悉 Redux 的 connect 函数或者 React Router 的 withRouter 函数，那么你已经使用过高阶组件了。

### 回调渲染组件

另一个比较高端的复用组件逻辑的方法是将函数作为组件的 `props.children`，该方法也称为 **Function as Child Components**。我们将使用** 渲染回调 **来重新实现上面的可扩展 Menu:

```jsx
class Toggleable extends React.Component {
  constructor() {
    super()
    this.toggle = this.toggle.bind(this)
    this.state = {show: false}
  }

  toggle() {
    this.setState(prevState => ({ show: !prevState.show }))
  }

  render() {
    return this.props.children(this.state.show, this.toggle)
  }
}
```

现在，我们可以将函数作为组件的子级进行传递:

```jsx
<Toggleable>
  {(show, onClick) => (
    <div>
      <div onClick={onClick}>
        <h1>{props.title}</h1>
      </div>
      {show && props.children}
    </div>
  )}
</Toggleable>
```

上面的代码已经将一个函数作为** 子组件 **，但是，若我们想复用上述逻辑，我们需要创建一个转换逻辑的新组件：

```jsx
const ToggleableMenu = props =>
  <Toggleable>
    {(show, onClick) => (
      <div>
        <div onClick={onClick}>
          <h1>{props.title}</h1>
        </div>
        {show && props.children}
      </div>
    )}
  </Toggleable>
```

我们使用 Render Callbacks 实现的可扩展的 Menu 组件如下:

```jsx
class Menu extends React.Component {
  render() {
    return (
      <div>
        <ToggleableMenu title="First Menu">
          <p>Some content</p>
        </ToggleableMenu>
        <ToggleableMenu title="Second Menu">
          <p>Another content</p>
        </ToggleableMenu>
        <ToggleableMenu title="Third Menu">
          <p>More content</p>
        </ToggleableMenu>
      </div>
    )
  }
}
```

回调渲染组件 (Render Callbacks) 和高阶函数使我们的组件更加灵活，掌握和适应起来具有一定的难度，需要反复学习和消化。
