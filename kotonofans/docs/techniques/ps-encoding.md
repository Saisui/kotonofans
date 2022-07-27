---
description: 修复古早PSD文件图层名乱码问题的方法
time: "2022-6-12 09:16:00"
alias: Photoshop修复
tags:
  - Photoshop
  - psd
  - 乱码
  - 立绘
---

# Photoshop图层乱码问题

!!! note "一般快速解决"

	在[^^本站的QQ群^^]{859299200}里有相关软件的下载，启动该`exe`程序，会将当前目录中所有`psd`文件的图层乱码问题解决。

## ***1. “为什么！？”***

#### 根本原因

在使用 *日语环境的软件* 时，经常会遇到 **乱码** 问题，有时候甚至需要转区。其原因就在于，日语环境的Windows采用[Shift-JIS](https://en.wikipedia.org/wiki/Shift_JIS){target=_blank}编码，而我们平时用的中文版Windows是[GBK](https://en.wikipedia.org/wiki/GBK_(character_encoding)){target=_blank}编码，俩者 **编码不统一** 导致解码出错。
<!--一个简单的解决方案是更改Windows系统 **“非Unicode程序的语言中所使用的当前语言”** 选项，但这样会导致一部分中文程序无法运行，所以并不推荐。-->

??? question "为什么解压文件时选了日语编码，结果还是乱码了？" 

    解压时选择日语编码是非常明智的。只不过这个方法一般只能解决解压出来的 ***文件名乱码*** 问题，并不能解决程序内部字符乱码问题。

#### *“但不是所有立绘都会乱码......”*

是的，有的PSD立绘，即使是日本画师的作品、即使图层名是日语，但也没有乱码。这是因为较新的PSD文件（Photoshop 5.0）增加了Unicode图层名的功能（[Unicode layer name](https://www.adobe.com/devnet-apps/photoshop/fileformatashtml/){target=_blank}），而Unicode在所有电脑上都通用。

## ***2. “怎么办？”***

#### 在Photoshop中使用Jsx脚本

[下载链接](https://share.weiyun.com/eGHLj6uj){target=_blank}

!!! note "原理"

    该方法的原理就是单纯地更改图层名。源代码都在脚本中，没有加密。

??? example "如何使用"

    * 保证PS_ShiftjisToUtf8.jsx 和 PS_ShiftjisToUtf8 文件夹在同一目录。
    * 在Ps将要改名字的图层编为一个组，选中这个组。
    * 然后使用jsx脚本（将jsx脚本直接拖进ps或者在Ps的`文件-脚本`中使用）
    * 等待一段时间，即可看到图层重命名了。之后把组给去除就行了。

#### 使用Python

也可以使用Python的[psd-tools](https://psd-tools.readthedocs.io/en/latest/){target=_blank}来更改PSD图层名。使用`pip install psd-tools`安装[psd-tools](https://psd-tools.readthedocs.io/en/latest/){target=_blank}。

??? question "想想看：这两个示例会有什么不同？"

    示例一中直接将Shift-JIS转换为GBK，乍一看似乎没有问题，而且代码很简洁。但是，***Shift-JIS中存在GBK中没有的字符***，比如ｴﾋﾞﾌﾗｲ这样半宽的假名。在转换这些字符时，示例一会 **报错**。而示例二直接使用Unicode，避免了这个问题。

示例一：
```python
from psd_tools import PSDImage

filename = "example.psd"
psd = PSDImage.open(filename, encoding="Shift-JIS")
psd.save(f'GBK_{filename}', encoding="GBK")
```

示例二：
```python
from psd_tools import PSDImage
from psd_tools.constants import Tag

def writeBlock(group):
    for layer in group:
        # 直接更改Unicode图层名
        # Directly set Unicode layer name
        layer._record.tagged_blocks.set_data(Tag.UNICODE_LAYER_NAME, layer.name)
        if layer.is_group():
            writeBlock(layer)

filename = "example.psd"
psd = PSDImage.open(filename, encoding="Shift-JIS")
writeBlock(psd)
psd.save(f'Unicode_{filename}', encoding="Shift-JIS")
```