---
title: 泰山派移植LVGL
category: 随笔/工具
date: 2026-06-29
author: Stellan W
views: 3280
tags:
  - Linux buildroot
  - LVGL
  - kernel 6.1
  - MIPI DSI
---
# 1. 点亮MIPI屏幕

|          物料          |  参数  |                                                                                            链接                                                                                            |
| :---------------------: | :-----: | :-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| 2.4寸MIPI屏幕（带触摸） | 480*640 | [屏幕链接](https://item.taobao.com/item.htm?id=678874170680&mi_id=0000duW3kwnhti38udV4bjqLUHBNF3kEOwoZu59ZdOH1svU&spm=tbpc.boughtlist.suborder_itemtitle.1.61842e8dc0l8YR&skuId=5507656490931) |

## 1.1 修改设备树

进入该路径后对该文件进行修改以适配mipi （路径为kernel-6.1/arch/arm64/boot/dts/rockchip/tspi-rk3566-user-v10-linux.dts）

```C
/ {
	backlight: backlight {
		compatible = "pwm-backlight";
		pwms = <&pwm9 0 25000 0>;
		brightness-levels = <
			  0  20  20  21  21  22  22  23
			 23  24  24  25  25  26  26  27
			 27  28  28  29  29  30  30  31
			 31  32  32  33  33  34  34  35
			 35  36  36  37  37  38  38  39
			 40  41  42  43  44  45  46  47
			 48  49  50  51  52  53  54  55
			 56  57  58  59  60  61  62  63
			 64  65  66  67  68  69  70  71
			 72  73  74  75  76  77  78  79
			 80  81  82  83  84  85  86  87
			 88  89  90  91  92  93  94  95
			 96  97  98  99 100 101 102 103
			104 105 106 107 108 109 110 111
			112 113 114 115 116 117 118 119
			120 121 122 123 124 125 126 127
			128 129 130 131 132 133 134 135
			136 137 138 139 140 141 142 143
			144 145 146 147 148 149 150 151
			152 153 154 155 156 157 158 159
			160 161 162 163 164 165 166 167
			168 169 170 171 172 173 174 175
			176 177 178 179 180 181 182 183
			184 185 186 187 188 189 190 191
			192 193 194 195 196 197 198 199
			200 201 202 203 204 205 206 207
			208 209 210 211 212 213 214 215
			216 217 218 219 220 221 222 223
			224 225 226 227 228 229 230 231
			232 233 234 235 236 237 238 239
			240 241 242 243 244 245 246 247
			248 249 250 251 252 253 254 255
		>;
		default-brightness-level = <255>;
	};
};

&pwm9 {
	status = "okay";
};

&pinctrl {
	dsi1 {
		dsi1_rst_gpio: dsi1-rst-gpio {
			rockchip,pins = <3 RK_PC1 RK_FUNC_GPIO &pcfg_pull_none>;
		};
	};
};

&i2c1 {
    status = "okay";
    clock-frequency = <400000>;

    cst328: hynitron@1a {
        compatible = "hyn,3xx";
        reg = <0x1a>;
        irq-gpio = <&gpio1 RK_PA0 IRQ_TYPE_LEVEL_LOW>;
        reset-gpios = <&gpio1 RK_PA1 GPIO_ACTIVE_HIGH>;
        max-touch-number = <5>;
        display-coords = <0 0 480 640>;
        pos-swap = <0>;
        posx-reverse = <0>;
        posy-reverse = <0>;
        status = "okay";
    };
};

&dsi1 {
	status = "okay";
	rockchip,lane-rate = <500>;
	dsi1_panel: panel@0 {
		status = "okay";
		compatible = "simple-panel-dsi";
		reset-gpios = <&gpio3 RK_PC1 GPIO_ACTIVE_LOW>;
		pinctrl-names = "default";
		pinctrl-0 = <&dsi1_rst_gpio>;
		reg = <0>;
		backlight = <&backlight>;
		reset-delay-ms = <10>;
		enable-delay-ms = <20>;
		prepare-delay-ms = <20>;
		unprepare-delay-ms = <20>;
		disable-delay-ms = <20>;
		init-delay-ms = <120>;
		dsi,flags = <(MIPI_DSI_MODE_VIDEO | MIPI_DSI_MODE_VIDEO_BURST |
			MIPI_DSI_MODE_LPM | MIPI_DSI_MODE_NO_EOT_PACKET)>;
		dsi,format = <MIPI_DSI_FMT_RGB888>;
		dsi,lanes  = <2>;
		rotation = <90>;
		panel-init-sequence = [
			39 00 06 FF 77 01 00 00 13
			15 00 02 EF 08
			39 00 06 FF 77 01 00 00 10
			39 00 03 C0 4F 00
			39 00 03 C1 10 0C
			39 00 03 C2 01 14
			15 00 02 CC 10
			39 00 11 B0 00 0B 13 0D 10 07 02 08 07 1F 04 11 0F 28 2F 1F
			39 00 11 B1 00 0C 13 0C 10 05 02 08 08 1E 05 13 11 27 30 1F
			39 00 06 FF 77 01 00 00 11
			15 00 02 B0 4D
			15 00 02 B1 4D
			15 00 02 B2 87
			15 00 02 B3 80
			15 00 02 B5 45
			15 00 02 B7 85
			15 00 02 B8 20
			15 00 02 C0 09
			15 00 02 C1 78
			15 00 02 C2 78
			15 64 02 D0 88
			39 00 04 E0 00 00 02
			39 00 0C E1 04 B0 06 B0 05 B0 07 B0 00 44 44
			39 00 0D E2 20 20 44 44 96 A0 00 00 96 A0 00 00
			39 00 05 E3 00 00 22 22
			39 00 03 E4 44 44
			39 00 11 E5 0C 90 B0 A0 0E 92 B0 A0 08 8C B0 A0 0A 8E B0 A0
			39 00 05 E6 00 00 22 22
			39 00 03 E7 44 44
			39 00 11 E8 0D 91 B0 A0 0F 93 B0 A0 09 8D B0 A0 0B 8F B0 A0
			39 00 03 E9 36 00
			39 00 08 EB 00 00 E4 E4 44 88 40
			39 00 11 ED C1 A2 BF 0F 67 45 FF FF FF FF 54 76 F0 FB 2A 1C
			39 00 07 EF 10 0D 04 08 3F 1F
			39 00 06 FF 77 01 00 00 13
			39 00 03 E8 00 0E
			39 00 06 FF 77 01 00 00 00
			05 78 01 11
			39 00 06 FF 77 01 00 00 13
			39 0A 03 E8 00 0C
			39 00 03 E8 00 00
			39 00 06 FF 77 01 00 00 00
			05 14 01 29
		];

		panel-exit-sequence = [
			05 00 01 28
			05 00 01 10
		];

		disp_timings1: display-timings {
			native-mode = <&dsi1_timing0>;
			dsi1_timing0: timing0 {
				clock-frequency = <22000000>;
				hactive = <480>;
				hfront-porch = <20>;
				hback-porch = <20>;
				hsync-len = <20>;
				vactive = <640>;
				vfront-porch = <16>;
				vback-porch = <14>;
				vsync-len = <2>;
				hsync-active = <0>;
				vsync-active = <0>;
				de-active = <0>;
				pixelclk-active = <0>;
				swap-rb = <0>;
				swap-rg = <0>;
				swap-gb = <0>;
			};
		};    
		ports {
            #address-cells = <1>;
            #size-cells = <0>;
            port@0 {
                reg = <0>;
                panel_in_dsi1: endpoint {
                        remote-endpoint = <&dsi1_out_panel>;
                };
            };
        };
	};
	ports {
        #address-cells = <1>;
        #size-cells = <0>;
        port@1 {
            reg = <1>;
            dsi1_out_panel: endpoint {
                    remote-endpoint = <&panel_in_dsi1>;
            };
        };
	};
};

&dsi1_in_vp0 {
	status = "okay";
};

&dsi1_in_vp1 {
	status = "disabled";
};

&video_phy1 {
	status = "okay";
};

&route_dsi1 {
	status = "okay";
	connect = <&vp0_out_dsi1>;
};
```


# 2.1 移植LVGL

1.执行以下命令获取源码

```Shell
git clone https://github.com/lvgl/lv_port_linux.git
cd lv_port_linux/
git submodule update --init --recursive
```

2.安装交叉编译器

```Shell
sudo apt install gcc-aarch64-linux-gnu g++-aarch64-linux-gnu
```

3.在lv_port_linux目录中，编写 `toolchain.cmake` ，方便用于指定交叉编译工具

```Shell
set(CMAKE_SYSTEM_NAME Linux)
set(CMAKE_SYSTEM_PROCESSOR arm64)
 
set(tools "/usr")
set(CMAKE_C_COMPILER /usr/bin/aarch64-linux-gnu-gcc)
set(CMAKE_CXX_COMPILER /usr/bin/aarch64-linux-gnu-g++)
```

4.指定交叉编译工具之后，为了更加方便执行编译操作，在lv_port_linux目录中，编写一个小脚本 `build.sh`，**添加可执行权限`chmod +x build.sh`。**

```Shell
rm -rf build
mkdir -p build
cd build/
cmake -DCMAKE_TOOLCHAIN_FILE="../toolchain.cmake" ..
make -j32
```

5.如果提示缺少 `libevdev` **库，缺少其它一样按照即可。**

```Shell
sudo apt install libevdev-dev:arm64
```
