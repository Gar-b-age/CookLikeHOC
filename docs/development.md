# 本地开发

### 前置依赖

在开始之前，请确保你的开发环境中安装了 [Node.js](https://nodejs.org/) (推荐 v18.x 或更高版本)。

- **Windows:**

  可以从 [Node.js 官网](https://nodejs.org/en/download/) 下载安装包进行安装。
  或者使用包管理器 [Chocolatey](https://chocolatey.org/):
  ```bash
  choco install nodejs
  ```

- **macOS:**

  可以从 [Node.js 官网](https://nodejs.org/en/download/) 下载安装包进行安装。
  或者使用包管理器 [Homebrew](https://brew.sh/):
  ```bash
  brew install node
  ```

- **Linux:**

  对于 Debian/Ubuntu 系统，可以使用 [NodeSource](https://github.com/nodesource/distributions) 来安装:
  ```bash
  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
  sudo apt-get install -y nodejs
  ```

  对于 RHEL/CentOS 系统:
  ```bash
  curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
  sudo yum install -y nodejs
  ```

### 启动项目

1. 克隆代码仓库

   ```bash
   git clone https://github.com/Gar-b-age/CookLikeHOC.git
   ```

2. 进入项目目录

   ```bash
   cd CookLikeHOC
   ```

3. 安装依赖

   ```bash
   npm install
   ```

4. 运行

   ```bash
   npm run docs:dev
   ```

   然后打开浏览器，访问 
   ```
   http://localhost:5173/ 
   ```
   即可。