<template>
  <div :style="{ height, overflow: 'auto' }">
    <div id="registration" style="padding-bottom: 10px">
      <!--StartFragment-->
      <div class="Section0" style="layout-grid: 15.6pt" />
      <span
        style="
          mso-spacerun: 'yes';
          font-family: 仿宋;
          mso-ansi-font-weight: bold;
          font-size: 16pt;
          mso-font-kerning: 1pt;
        "
        ><br
          clear="all"
          style="page-break-before: always; mso-break-type: section-break"
      /></span>
      <div class="Section1" style="layout-grid: 15.6pt">
        <p
          class="MsoNormal"
          align="center"
          style="
            text-indent: 36.15pt;
            mso-char-indent-count: 2;
            text-align: center;
          "
        >
          <b style="mso-bidi-font-weight: normal"
            ><span
              style="
                mso-spacerun: 'yes';
                font-family: 仿宋;
                mso-ansi-font-weight: bold;
                font-size: 18pt;
                mso-font-kerning: 1pt;
              "
              ><font face="仿宋">应聘人员登记表</font></span
            ></b
          ><b style="mso-bidi-font-weight: normal"
            ><span
              style="
                mso-spacerun: 'yes';
                font-family: 仿宋;
                mso-ansi-font-weight: bold;
                font-size: 18pt;
                mso-font-kerning: 1pt;
              "
              ><span /></span
          ></b>
        </p>
        <p
          class="MsoNormal"
          align="justify"
          style="
            margin: 1em 0;
            margin-left: -8.9pt;
            mso-para-margin-left: -0.85gd;
            text-indent: 21pt;
            mso-char-indent-count: 2;
            text-align: center;
            text-justify: inter-ideograph;
          "
        >
          <span
            style="
              mso-spacerun: 'yes';
              font-family: 仿宋;
              font-size: 10.5pt;
              mso-font-kerning: 1pt;
            "
            >&#9;&#9;&#9;&#9;&#9;&#9;&#9;&#9;&#9;&#9;&#9;&#9;&#9;&#9;&#9;&#9;&#9;&#9;&#9;</span
          ><span
            style="
              mso-spacerun: 'yes';
              font-family: 仿宋;
              font-size: 10.5pt;
              mso-font-kerning: 1pt;
            "
            ><font face="仿宋">应聘岗位：</font></span
          ><u
            ><span
              style="
                mso-spacerun: 'yes';
                font-family: 仿宋;
                text-decoration: underline;
                text-underline: single;
                font-size: 10.5pt;
                mso-font-kerning: 1pt;
              "
              >{{ detailBaseInfo.positionName }}</span
            ></u
          ><span
            style="
              mso-spacerun: 'yes';
              font-family: 仿宋;
              font-size: 10.5pt;
              mso-font-kerning: 1pt;
            "
            >&nbsp;&nbsp;&nbsp;<font face="仿宋">期望薪资要求：</font></span
          ><u
            ><span
              style="
                mso-spacerun: 'yes';
                font-family: 仿宋;
                text-decoration: underline;
                text-underline: single;
                font-size: 10.5pt;
                mso-font-kerning: 1pt;
              "
              >{{ detailBaseInfo.expectedSalary }}</span
            ></u
          ><span
            style="
              mso-spacerun: 'yes';
              font-family: 仿宋;
              font-size: 10.5pt;
              mso-font-kerning: 1pt;
            "
            >&nbsp;&nbsp;&nbsp;<font face="仿宋">填表日期：</font></span
          ><u
            ><span
              style="
                mso-spacerun: 'yes';
                font-family: 仿宋;
                text-decoration: underline;
                text-underline: single;
                font-size: 10.5pt;
                mso-font-kerning: 1pt;
              "
              >{{ new Date(detailBaseInfo.fillFormDate).getFullYear() }}</span
            ></u
          ><span
            style="
              mso-spacerun: 'yes';
              font-family: 仿宋;
              font-size: 10.5pt;
              mso-font-kerning: 1pt;
            "
            ><font face="仿宋">年</font></span
          ><u
            ><span
              style="
                mso-spacerun: 'yes';
                font-family: 仿宋;
                text-decoration: underline;

                text-underline: single;
                font-size: 10.5pt;
                mso-font-kerning: 1pt;
              "
              >{{ new Date(detailBaseInfo.fillFormDate).getMonth() + 1 }}</span
            ></u
          ><span
            style="
              mso-spacerun: 'yes';
              font-family: 仿宋;
              font-size: 10.5pt;
              mso-font-kerning: 1pt;
            "
            ><font face="仿宋">月</font></span
          ><u
            ><span
              style="
                mso-spacerun: 'yes';
                font-family: 仿宋;
                text-decoration: underline;
                text-underline: single;
                font-size: 10.5pt;
                mso-font-kerning: 1pt;
              "
              >{{ new Date(detailBaseInfo.fillFormDate).getDate() }}</span
            ></u
          ><span
            style="
              mso-spacerun: 'yes';
              font-family: 仿宋;
              font-size: 10.5pt;
              mso-font-kerning: 1pt;
            "
            ><font face="仿宋">日</font></span
          ><u
            ><span
              style="
                mso-spacerun: 'yes';
                font-family: 仿宋;
                text-decoration: underline;
                text-underline: single;
                font-size: 10.5pt;
                mso-font-kerning: 1pt;
              "
              ><span /></span
          ></u>
        </p>

        <table
          class="MsoNormalTable"
          align="center"
          border="1"
          cellspacing="0"
          style="
            border-collapse: collapse;
            width: 20.99cm;
            height: 29.7cm;
            margin: 0 auto;
            mso-table-layout-alt: fixed;
            border: none;
            mso-border-left-alt: 1.5pt solid windowtext;
            mso-border-top-alt: 1.5pt solid windowtext;
            mso-border-right-alt: 1.5pt solid windowtext;
            mso-border-bottom-alt: 1.5pt solid windowtext;
            mso-border-insideh: 0.5pt dotted windowtext;
            mso-border-insidev: 0.5pt dotted windowtext;
            mso-padding-alt: 0pt 5.4pt 0pt 5.4pt;
          "
        >
          <tr style="height: 30.2pt; page-break-inside: avoid">
            <td
              width="485"
              valign="center"
              colspan="13"
              style="
                width: 485pt;
                padding: 0pt 5.4pt 0pt 5.4pt;
                border-left: 1pt solid windowtext;
                mso-border-left-alt: 0.5pt solid windowtext;
                border-right: 1pt solid windowtext;
                mso-border-right-alt: 0.5pt solid windowtext;
                border-top: 1pt solid windowtext;
                mso-border-top-alt: 0.5pt solid windowtext;
                border-bottom: 1pt solid windowtext;
                mso-border-bottom-alt: 0.5pt solid windowtext;
                background: rgb(230, 230, 230);
              "
            >
              <p
                class="MsoNormal"
                align="center"
                style="
                  text-align: center;
                  line-height: 15pt;
                  mso-line-height-rule: exactly;
                "
              >
                <span
                  style="
                    font-family: 仿宋;
                    font-size: 14pt;
                    mso-font-kerning: 1pt;
                  "
                  ><font face="仿宋">基本资料</font></span
                ><span
                  style="
                    font-family: 仿宋;
                    font-size: 14pt;
                    mso-font-kerning: 1pt;
                  "
                  ><span
                /></span>
              </p>
            </td>
          </tr>
          <tr style="height: 30.35pt; page-break-inside: avoid">
            <td
              width="70"
              valign="center"
              colspan="2"
              style="
                width: 70pt;
                padding: 0pt 5.4pt 0pt 5.4pt;
                border-left: 1pt solid windowtext;
                mso-border-left-alt: 0.5pt solid windowtext;
                border-right: 1pt solid windowtext;
                mso-border-right-alt: 0.5pt solid windowtext;
                border-top: none;
                mso-border-top-alt: 0.5pt solid windowtext;
                border-bottom: 1pt solid windowtext;
                mso-border-bottom-alt: 0.5pt solid windowtext;
              "
            >
              <p class="MsoNormal" align="center" style="text-align: center">
                <span
                  style="
                    font-family: 仿宋;
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><font face="仿宋">姓</font> <font face="仿宋">名</font></span
                ><span
                  style="
                    font-family: 仿宋;
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><span
                /></span>
              </p>
            </td>
            <td
              width="75"
              valign="center"
              colspan="2"
              style="
                width: 75.3pt;
                padding: 0pt 5.4pt 0pt 5.4pt;
                border-left: none;
                mso-border-left-alt: none;
                border-right: 1pt solid windowtext;
                mso-border-right-alt: 0.5pt solid windowtext;
                border-top: 1pt solid windowtext;
                mso-border-top-alt: 0.5pt solid windowtext;
                border-bottom: 1pt solid windowtext;
                mso-border-bottom-alt: 0.5pt solid windowtext;
              "
            >
              <p class="MsoNormal" align="center" style="text-align: center">
                <span
                  style="
                    font-family: 仿宋;
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><span>{{ detailBaseInfo.name }}</span></span
                >
              </p>
            </td>
            <td
              width="40"
              valign="center"
              colspan="3"
              style="
                width: 40.6pt;
                padding: 0pt 5.4pt 0pt 5.4pt;
                border-left: none;
                mso-border-left-alt: none;
                border-right: 1pt solid windowtext;
                mso-border-right-alt: 0.5pt solid windowtext;
                border-top: 1pt solid windowtext;
                mso-border-top-alt: 0.5pt solid windowtext;
                border-bottom: 1pt solid windowtext;
                mso-border-bottom-alt: 0.5pt solid windowtext;
              "
            >
              <p class="MsoNormal" align="center" style="text-align: center">
                <span
                  style="
                    font-family: 仿宋;
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><font face="仿宋">性</font> <font face="仿宋">别</font></span
                ><span
                  style="
                    font-family: 仿宋;
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><span
                /></span>
              </p>
            </td>
            <td
              width="88"
              valign="center"
              colspan="3"
              style="
                width: 88.9pt;
                padding: 0pt 5.4pt 0pt 5.4pt;
                border-left: none;
                mso-border-left-alt: none;
                border-right: 1pt solid windowtext;
                mso-border-right-alt: 0.5pt solid windowtext;
                border-top: 1pt solid windowtext;
                mso-border-top-alt: 0.5pt solid windowtext;
                border-bottom: 1pt solid windowtext;
                mso-border-bottom-alt: 0.5pt solid windowtext;
              "
            >
              <p class="MsoNormal" align="center" style="text-align: center">
                <span
                  style="
                    font-family: 仿宋;
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><span
                    v-if="detailBaseInfo.sex === 0 || detailBaseInfo.sex === 1"
                    >{{ detailBaseInfo.sex === 0 ? '男' : '女' }}</span
                  ></span
                >
              </p>
            </td>
            <td
              width="56"
              valign="center"
              colspan="2"
              style="
                width: 56.45pt;
                padding: 0pt 5.4pt 0pt 5.4pt;
                border-left: none;
                mso-border-left-alt: none;
                border-right: 1pt solid windowtext;
                mso-border-right-alt: 0.5pt solid windowtext;
                border-top: 1pt solid windowtext;
                mso-border-top-alt: 0.5pt solid windowtext;
                border-bottom: 1pt solid windowtext;
                mso-border-bottom-alt: 0.5pt solid windowtext;
              "
            >
              <p class="MsoNormal" align="center" style="text-align: center">
                <span
                  style="
                    font-family: 仿宋;
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><font face="仿宋">出生日期</font></span
                ><span
                  style="
                    font-family: 仿宋;
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><span
                /></span>
              </p>
            </td>
            <td
              width="153"
              valign="center"
              colspan="4"
              style="
                width: 153.75pt;
                padding: 0pt 5.4pt 0pt 5.4pt;
                border-left: none;
                mso-border-left-alt: none;
                border-right: 1pt solid windowtext;
                mso-border-right-alt: 0.5pt solid windowtext;
                border-top: 1pt solid windowtext;
                mso-border-top-alt: 0.5pt solid windowtext;
                border-bottom: 1pt solid windowtext;
                mso-border-bottom-alt: 0.5pt solid windowtext;
              "
            >
              <p class="MsoNormal" align="center" style="text-align: center">
                <span
                  style="
                    font-family: 仿宋;
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><span>{{ getTime(detailBaseInfo.birthday) }}</span></span
                >
              </p>
            </td>
          </tr>
          <tr style="height: 27.45pt; page-break-inside: avoid">
            <td
              width="70"
              valign="center"
              colspan="2"
              style="
                width: 70pt;
                padding: 0pt 5.4pt 0pt 5.4pt;
                border-left: 1pt solid windowtext;
                mso-border-left-alt: 0.5pt solid windowtext;
                border-right: 1pt solid windowtext;
                mso-border-right-alt: 0.5pt solid windowtext;
                border-top: none;
                mso-border-top-alt: 0.5pt solid windowtext;
                border-bottom: 1pt solid windowtext;
                mso-border-bottom-alt: 0.5pt solid windowtext;
              "
            >
              <p class="MsoNormal" align="center" style="text-align: center">
                <span
                  style="
                    font-family: 仿宋;
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><font face="仿宋">年</font> <font face="仿宋">龄</font></span
                ><span
                  style="
                    font-family: 仿宋;
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><span
                /></span>
              </p>
            </td>
            <td
              width="75"
              valign="center"
              colspan="2"
              style="
                width: 75.3pt;
                padding: 0pt 5.4pt 0pt 5.4pt;
                border-left: none;
                mso-border-left-alt: none;
                border-right: 1pt solid windowtext;
                mso-border-right-alt: 0.5pt solid windowtext;
                border-top: none;
                mso-border-top-alt: 0.5pt solid windowtext;
                border-bottom: 1pt solid windowtext;
                mso-border-bottom-alt: 0.5pt solid windowtext;
              "
            >
              <p class="MsoNormal" align="center" style="text-align: center">
                <span
                  style="
                    font-family: 仿宋;
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><span>{{ detailBaseInfo.age }}</span></span
                >
              </p>
            </td>
            <td
              width="40"
              valign="center"
              colspan="3"
              style="
                width: 40.6pt;
                padding: 0pt 5.4pt 0pt 5.4pt;
                border-left: none;
                mso-border-left-alt: none;
                border-right: 1pt solid windowtext;
                mso-border-right-alt: 0.5pt solid windowtext;
                border-top: none;
                mso-border-top-alt: 0.5pt solid windowtext;
                border-bottom: 1pt solid windowtext;
                mso-border-bottom-alt: 0.5pt solid windowtext;
              "
            >
              <p class="MsoNormal" align="center" style="text-align: center">
                <span
                  style="
                    font-family: 仿宋;
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><font face="仿宋">籍</font> <font face="仿宋">贯</font></span
                ><span
                  style="
                    font-family: 仿宋;
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><span
                /></span>
              </p>
            </td>
            <td
              width="88"
              valign="center"
              colspan="3"
              style="
                width: 88.9pt;
                padding: 0pt 5.4pt 0pt 5.4pt;
                border-left: none;
                mso-border-left-alt: none;
                border-right: 1pt solid windowtext;
                mso-border-right-alt: 0.5pt solid windowtext;
                border-top: none;
                mso-border-top-alt: 0.5pt solid windowtext;
                border-bottom: 1pt solid windowtext;
                mso-border-bottom-alt: 0.5pt solid windowtext;
              "
            >
              <p class="MsoNormal" align="center" style="text-align: center">
                <span
                  style="
                    font-family: 仿宋;
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><span v-if="detailBaseInfo.nativePlace">{{
                    detailBaseInfo.nativePlace
                  }}</span></span
                >
              </p>
            </td>
            <td
              width="56"
              valign="center"
              colspan="2"
              style="
                width: 56.45pt;
                padding: 0pt 5.4pt 0pt 5.4pt;
                border-left: none;
                mso-border-left-alt: none;
                border-right: 1pt solid windowtext;
                mso-border-right-alt: 0.5pt solid windowtext;
                border-top: none;
                mso-border-top-alt: 0.5pt solid windowtext;
                border-bottom: 1pt solid windowtext;
                mso-border-bottom-alt: 0.5pt solid windowtext;
              "
            >
              <p class="MsoNormal" align="center" style="text-align: center">
                <span
                  style="
                    font-family: 仿宋;
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><font face="仿宋">电子邮箱</font></span
                ><span
                  style="
                    font-family: 仿宋;
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><span
                /></span>
              </p>
            </td>
            <td
              width="153"
              valign="center"
              colspan="3"
              style="
                width: 153.75pt;
                padding: 0pt 5.4pt 0pt 5.4pt;
                border-left: none;
                mso-border-left-alt: none;
                border-right: 1pt solid windowtext;
                mso-border-right-alt: 0.5pt solid windowtext;
                border-top: none;
                mso-border-top-alt: 0.5pt solid windowtext;
                border-bottom: 1pt solid windowtext;
                mso-border-bottom-alt: 0.5pt solid windowtext;
              "
            >
              <p class="MsoNormal" align="center" style="text-align: center">
                <span
                  style="
                    font-family: 仿宋;
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><span>{{ detailBaseInfo.email }}</span></span
                >
              </p>
            </td>
          </tr>
          <tr style="height: 32.2pt; page-break-inside: avoid">
            <!-- 学历 -->
            <td
              width="70"
              valign="center"
              colspan="2"
              style="
                width: 70pt;
                padding: 0pt 5.4pt 0pt 5.4pt;
                border-left: 1pt solid windowtext;
                mso-border-left-alt: 0.5pt solid windowtext;
                border-right: 1pt solid windowtext;
                mso-border-right-alt: 0.5pt solid windowtext;
                border-top: none;
                mso-border-top-alt: 0.5pt solid windowtext;
                border-bottom: 1pt solid windowtext;
                mso-border-bottom-alt: 0.5pt solid windowtext;
              "
            >
              <p class="MsoNormal" align="center" style="text-align: center">
                <span
                  style="
                    font-family: 仿宋;
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><font face="仿宋">学</font> <font face="仿宋">历</font></span
                ><span
                  style="
                    font-family: 仿宋;
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><span
                /></span>
              </p>
            </td>
            <td
              width="75"
              valign="center"
              colspan="2"
              style="
                width: 75.3pt;
                padding: 0pt 5.4pt 0pt 5.4pt;
                border-left: none;
                mso-border-left-alt: none;
                border-right: 1pt solid windowtext;
                mso-border-right-alt: 0.5pt solid windowtext;
                border-top: none;
                mso-border-top-alt: 0.5pt solid windowtext;
                border-bottom: 1pt solid windowtext;
                mso-border-bottom-alt: 0.5pt solid windowtext;
              "
            >
              <p class="MsoNormal" align="center" style="text-align: center">
                <span
                  style="
                    font-family: 仿宋;
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><span>{{
                    educationTypeMap.get(parseInt(detailBaseInfo.education))
                  }}</span></span
                >
              </p>
            </td>
            <!-- 学历end -->
            <td
              width="70"
              valign="center"
              colspan="3"
              style="
                width: 70pt;
                padding: 0pt 5.4pt 0pt 5.4pt;
                border-left: none;
                mso-border-left-alt: none;
                border-right: 1pt solid windowtext;
                mso-border-right-alt: 0.5pt solid windowtext;
                border-top: none;
                mso-border-top-alt: 0.5pt solid windowtext;
                border-bottom: 1pt solid windowtext;
                mso-border-bottom-alt: 0.5pt solid windowtext;
              "
            >
              <p class="MsoNormal" align="center" style="text-align: center">
                <span
                  style="
                    font-family: 仿宋;
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><font face="仿宋">婚姻状况</font></span
                ><span
                  style="
                    font-family: 仿宋;
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><span
                /></span>
              </p>
            </td>
            <td
              width="75"
              valign="center"
              colspan="2"
              style="
                width: 75.3pt;
                padding: 0pt 5.4pt 0pt 5.4pt;
                border-left: none;
                mso-border-left-alt: none;
                border-right: 1pt solid windowtext;
                mso-border-right-alt: 0.5pt solid windowtext;
                border-top: none;
                mso-border-top-alt: 0.5pt solid windowtext;
                border-bottom: 1pt solid windowtext;
                mso-border-bottom-alt: 0.5pt solid windowtext;
              "
            >
              <p class="MsoNormal" align="center" style="text-align: center">
                <span
                  style="
                    font-family: 仿宋;
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><span>{{
                    maritalStatusMap[detailBaseInfo.maritalStatus]
                  }}</span></span
                >
              </p>
            </td>
            <td
              width="129"
              valign="center"
              colspan="3"
              style="
                width: 129.5pt;
                padding: 0pt 5.4pt 0pt 5.4pt;
                border-left: none;
                mso-border-left-alt: none;
                border-right: 1pt solid windowtext;
                mso-border-right-alt: 0.5pt solid windowtext;
                border-top: none;
                mso-border-top-alt: 0.5pt solid windowtext;
                border-bottom: 1pt solid windowtext;
                mso-border-bottom-alt: 0.5pt solid windowtext;
              "
            >
              <p class="MsoNormal" align="center" style="text-align: center">
                <span
                  style="
                    font-family: 仿宋;
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><font face="仿宋">子女情况</font></span
                ><span
                  style="
                    font-family: 仿宋;
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><span
                /></span>
              </p>
            </td>
            <td
              width="210"
              valign="center"
              colspan="5"
              style="
                width: 210.2pt;
                padding: 0pt 5.4pt 0pt 5.4pt;
                border-left: none;
                mso-border-left-alt: none;
                border-right: 1pt solid windowtext;
                mso-border-right-alt: 0.5pt solid windowtext;
                border-top: none;
                mso-border-top-alt: 0.5pt solid windowtext;
                border-bottom: 1pt solid windowtext;
                mso-border-bottom-alt: 0.5pt solid windowtext;
              "
            >
              <p class="MsoNormal" align="center" style="text-align: center">
                <span
                  v-if="detailBaseInfo.childrenNumber"
                  style="
                    font-family: 仿宋;
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><span style="font-family: 仿宋; mso-spacerun: 'yes'"
                    >&nbsp;&nbsp;&nbsp;&nbsp;</span
                  ><font face="仿宋"
                    >{{ detailBaseInfo.childrenNumber }}孩</font
                  ></span
                >

                <span
                  v-if="!detailBaseInfo.childrenNumber"
                  style="
                    font-family: 仿宋;
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><span style="font-family: 仿宋; mso-spacerun: 'yes'"
                    >&nbsp;&nbsp;&nbsp;&nbsp;</span
                  ><font face="仿宋" style="vertical-align: top">无</font></span
                >
                <span
                  v-if="!detailBaseInfo.childrenNumber"
                  style="
                    font-family: 'Wingdings 2';
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><font face="仿宋"
                    ><span class="checkbox"
                      ><i
                        v-if="detailBaseInfo.childrenNumber === 0"
                        class="icon el-icon-check" /></span></font></span
                ><span
                  style="
                    font-family: 仿宋;
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><span
                /></span>
              </p>
            </td>
          </tr>
          <tr style="height: 32.2pt; page-break-inside: avoid">
            <td
              width="70"
              valign="center"
              colspan="2"
              style="
                width: 70pt;
                padding: 0pt 5.4pt 0pt 5.4pt;
                border-left: 1pt solid windowtext;
                mso-border-left-alt: 0.5pt solid windowtext;
                border-right: 1pt solid windowtext;
                mso-border-right-alt: 0.5pt solid windowtext;
                border-top: none;
                mso-border-top-alt: 0.5pt solid windowtext;
                border-bottom: 1pt solid windowtext;
                mso-border-bottom-alt: 0.5pt solid windowtext;
              "
            >
              <p class="MsoNormal" align="center" style="text-align: center">
                <span
                  style="
                    font-family: 仿宋;
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><font face="仿宋">联系方式</font></span
                ><span
                  style="
                    font-family: 仿宋;
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><span
                /></span>
              </p>
            </td>
            <td
              width="75"
              valign="center"
              colspan="2"
              style="
                width: 75.3pt;
                padding: 0pt 5.4pt 0pt 5.4pt;
                border-left: none;
                mso-border-left-alt: none;
                border-right: 1pt solid windowtext;
                mso-border-right-alt: 0.5pt solid windowtext;
                border-top: none;
                mso-border-top-alt: 0.5pt solid windowtext;
                border-bottom: 1pt solid windowtext;
                mso-border-bottom-alt: 0.5pt solid windowtext;
              "
            >
              <p class="MsoNormal" align="center" style="text-align: center">
                <span
                  style="
                    font-family: 仿宋;
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><span>{{ detailBaseInfo.phone }}</span></span
                >
              </p>
            </td>
            <td
              width="59"
              valign="center"
              colspan="2"
              style="
                width: 59.35pt;
                padding: 0pt 5.4pt 0pt 5.4pt;
                border-left: none;
                mso-border-left-alt: none;
                border-right: 1pt solid windowtext;
                mso-border-right-alt: 0.5pt solid windowtext;
                border-top: none;
                mso-border-top-alt: 0.5pt solid windowtext;
                border-bottom: 1pt solid windowtext;
                mso-border-bottom-alt: 0.5pt solid windowtext;
              "
            >
              <p
                class="MsoNormal"
                align="center"
                style="
                  text-align: center;
                  word-break: break-all;
                  word-wrap: break-word;
                "
              >
                <span
                  style="
                    font-family: 仿宋;
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><font face="仿宋">现住址</font></span
                ><span
                  style="
                    font-family: 仿宋;
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><span
                /></span>
              </p>
            </td>
            <td
              width="280"
              valign="center"
              colspan="7"
              style="
                width: 280.35pt;
                padding: 0pt 5.4pt 0pt 5.4pt;
                border-left: none;
                mso-border-left-alt: none;
                border-right: 1pt solid windowtext;
                mso-border-right-alt: 0.5pt solid windowtext;
                border-top: none;
                mso-border-top-alt: 0.5pt solid windowtext;
                border-bottom: 1pt solid windowtext;
                mso-border-bottom-alt: 0.5pt solid windowtext;
              "
            >
              <p
                class="MsoNormal"
                align="center"
                style="
                  text-align: center;
                  word-break: break-all;
                  word-wrap: break-word;
                "
              >
                <span
                  style="
                    font-family: 仿宋;
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><span>{{ detailBaseInfo.address }}</span></span
                >
              </p>
            </td>
          </tr>
          <tr style="height: 33.25pt; page-break-inside: avoid">
            <td
              width="70"
              valign="center"
              colspan="2"
              style="
                width: 70pt;
                padding: 0pt 5.4pt 0pt 5.4pt;
                border-left: 1pt solid windowtext;
                mso-border-left-alt: 0.5pt solid windowtext;
                border-right: 1pt solid windowtext;
                mso-border-right-alt: 0.5pt solid windowtext;
                border-top: none;
                mso-border-top-alt: 0.5pt solid windowtext;
                border-bottom: 1pt solid windowtext;
                mso-border-bottom-alt: 0.5pt solid windowtext;
              "
            >
              <p class="MsoNormal" align="center" style="text-align: center">
                <span
                  style="
                    font-family: 仿宋;
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><font face="仿宋">目前状况</font></span
                ><span
                  style="
                    font-family: 仿宋;
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><span
                /></span>
              </p>
            </td>
            <td
              width="178"
              valign="center"
              colspan="6"
              style="
                width: 178.9pt;
                padding: 0pt 5.4pt 0pt 5.4pt;
                border-left: none;
                mso-border-left-alt: none;
                border-right: 1pt solid windowtext;
                mso-border-right-alt: 0.5pt solid windowtext;
                border-top: none;
                mso-border-top-alt: 0.5pt solid windowtext;
                border-bottom: 1pt solid windowtext;
                mso-border-bottom-alt: 0.5pt solid windowtext;
              "
            >
              <p class="MsoNormal" align="center" style="text-align: center">
                <span
                  style="
                    font-family: 仿宋;
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><font face="仿宋">在职</font></span
                ><span
                  style="
                    font-family: 'Wingdings 2';
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><font face="仿宋"
                    ><span class="checkbox"
                      ><i
                        v-if="detailBaseInfo.currentStatus === 1"
                        class="icon el-icon-check" /></span></font></span
                ><span
                  style="
                    font-family: 仿宋;
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><span style="font-family: 仿宋; mso-spacerun: 'yes'"
                    >&nbsp;&nbsp;&nbsp;&nbsp;</span
                  ><font face="仿宋">离职</font></span
                ><span
                  style="
                    font-family: 'Wingdings 2';
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><font face="仿宋"
                    ><span class="checkbox"
                      ><i
                        v-if="detailBaseInfo.currentStatus === 2"
                        class="icon el-icon-check" /></span></font></span
                ><span
                  style="
                    font-family: 仿宋;
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><span style="font-family: 仿宋; mso-spacerun: 'yes'"
                    >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
                  ><font face="仿宋">其他</font></span
                ><span
                  style="
                    font-family: 'Wingdings 2';
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><font face="仿宋"
                    ><span class="checkbox"
                      ><i
                        v-if="detailBaseInfo.currentStatus === 3"
                        class="icon el-icon-check" /></span></font
                ></span>
              </p>
            </td>
            <td
              width="86"
              valign="center"
              colspan="4"
              style="
                width: 86.05pt;
                padding: 0pt 5.4pt 0pt 5.4pt;
                border-left: none;
                mso-border-left-alt: none;
                border-right: 1pt solid windowtext;
                mso-border-right-alt: 0.5pt solid windowtext;
                border-top: none;
                mso-border-top-alt: 0.5pt solid windowtext;
                border-bottom: 1pt solid windowtext;
                mso-border-bottom-alt: 0.5pt solid windowtext;
              "
            >
              <p class="MsoNormal" align="center" style="text-align: center">
                <span
                  style="
                    font-family: 仿宋;
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><font face="仿宋">到岗时间</font></span
                ><span
                  style="
                    font-family: 仿宋;
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><span
                /></span>
              </p>
            </td>
            <td
              width="150"
              valign="center"
              colspan="1"
              style="
                width: 150.05pt;
                padding: 0pt 5.4pt 0pt 5.4pt;
                border-left: none;
                mso-border-left-alt: none;
                border-right: 1pt solid windowtext;
                mso-border-right-alt: 0.5pt solid windowtext;
                border-top: none;
                mso-border-top-alt: 0.5pt solid windowtext;
                border-bottom: 1pt solid windowtext;
                mso-border-bottom-alt: 0.5pt solid windowtext;
              "
            >
              <p class="MsoNormal" align="center" style="text-align: center">
                <span
                  style="
                    font-family: 仿宋;
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><span>{{ getTime(detailBaseInfo.arrivalTime) }}</span></span
                >
              </p>
            </td>
          </tr>
          <tr style="height: 21.2pt; page-break-inside: avoid">
            <td
              width="185"
              valign="center"
              colspan="5"
              style="
                width: 185.9pt;
                padding: 0pt 5.4pt 0pt 5.4pt;
                border-left: 1pt solid windowtext;
                mso-border-left-alt: 0.5pt solid windowtext;
                border-right: 1pt solid windowtext;
                mso-border-right-alt: 0.5pt solid windowtext;
                border-top: none;
                mso-border-top-alt: 0.5pt solid windowtext;
                border-bottom: 1pt solid windowtext;
                mso-border-bottom-alt: 0.5pt solid windowtext;
              "
            >
              <p class="MsoNormal" align="center" style="text-align: center">
                <span
                  style="
                    font-family: 仿宋;
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><font face="仿宋">其他原因</font></span
                ><span
                  style="
                    font-family: 仿宋;
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><span
                /></span>
              </p>
            </td>
            <td
              width="299"
              valign="center"
              colspan="8"
              style="
                width: 299.1pt;
                padding: 0pt 5.4pt 0pt 5.4pt;
                border-left: none;
                mso-border-left-alt: none;
                border-right: 1pt solid windowtext;
                mso-border-right-alt: 0.5pt solid windowtext;
                border-top: none;
                mso-border-top-alt: 0.5pt solid windowtext;
                border-bottom: 1pt solid windowtext;
                mso-border-bottom-alt: 0.5pt solid windowtext;
              "
            >
              <p class="MsoNormal" align="center" style="text-align: center">
                <span
                  style="
                    font-family: 仿宋;
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><font face="仿宋"
                    ><span>{{ detailBaseInfo.otherStatusDesc }}</span></font
                  ></span
                >
              </p>
            </td>
          </tr>
          <tr style="height: 21.2pt; page-break-inside: avoid">
            <td
              width="185"
              valign="center"
              colspan="5"
              style="
                width: 185.9pt;
                padding: 0pt 5.4pt 0pt 5.4pt;
                border-left: 1pt solid windowtext;
                mso-border-left-alt: 0.5pt solid windowtext;
                border-right: 1pt solid windowtext;
                mso-border-right-alt: 0.5pt solid windowtext;
                border-top: none;
                mso-border-top-alt: 0.5pt solid windowtext;
                border-bottom: 1pt solid windowtext;
                mso-border-bottom-alt: 0.5pt solid windowtext;
              "
            >
              <p class="MsoNormal" align="center" style="text-align: center">
                <span
                  style="
                    font-family: 仿宋;
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><font face="仿宋">从哪种途径了解本公司招聘信息</font></span
                ><span
                  style="
                    font-family: 仿宋;
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><span
                /></span>
              </p>
            </td>
            <td
              width="299"
              valign="center"
              colspan="8"
              style="
                width: 299.1pt;
                padding: 0pt 5.4pt 0pt 5.4pt;
                border-left: none;
                mso-border-left-alt: none;
                border-right: 1pt solid windowtext;
                mso-border-right-alt: 0.5pt solid windowtext;
                border-top: none;
                mso-border-top-alt: 0.5pt solid windowtext;
                border-bottom: 1pt solid windowtext;
                mso-border-bottom-alt: 0.5pt solid windowtext;
              "
            >
              <p class="MsoNormal" align="center" style="text-align: center">
                <span
                  style="
                    font-family: 仿宋;
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><font face="仿宋">BOSS</font></span
                ><span
                  style="
                    font-family: 'Wingdings 2';
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><font face="仿宋"
                    ><span class="checkbox"
                      ><i
                        v-if="detailBaseInfo.source === 1"
                        class="icon el-icon-check" /></span></font></span
                ><span
                  style="
                    font-family: 仿宋;
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><span style="font-family: 仿宋; mso-spacerun: 'yes'"
                    >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
                  ><font face="仿宋">拉勾</font></span
                ><span
                  style="
                    font-family: 'Wingdings 2';
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><font face="仿宋"
                    ><span class="checkbox"
                      ><i
                        v-if="detailBaseInfo.source === 4"
                        class="icon el-icon-check" /></span></font></span
                ><span
                  style="
                    font-family: 仿宋;
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><span style="font-family: 仿宋; mso-spacerun: 'yes'"
                    >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
                  ><font face="仿宋">前程无忧</font></span
                ><span
                  style="
                    font-family: 'Wingdings 2';
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><font face="仿宋"
                    ><span class="checkbox"
                      ><i
                        v-if="detailBaseInfo.source === 3"
                        class="icon el-icon-check" /></span></font></span
                ><span
                  style="
                    font-family: 仿宋;
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><span style="font-family: 仿宋; mso-spacerun: 'yes'"
                    >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
                  ><font face="仿宋">智联</font></span
                ><span
                  style="
                    font-family: 'Wingdings 2';
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><font face="仿宋"
                    ><span class="checkbox"
                      ><i
                        v-if="detailBaseInfo.source === 2"
                        class="icon el-icon-check" /></span></font></span
                ><span
                  style="
                    font-family: 仿宋;
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><font face="仿宋">公众号</font
                  ><font face="仿宋">/朋友圈</font></span
                ><span
                  style="
                    font-family: 'Wingdings 2';
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><font face="仿宋"
                    ><span class="checkbox"
                      ><i
                        v-if="detailBaseInfo.source === 7"
                        class="icon el-icon-check" /></span></font></span
                ><span
                  style="
                    font-family: 仿宋;
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><span style="font-family: 仿宋; mso-spacerun: 'yes'"
                    >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
                  ><font face="仿宋">猎聘</font></span
                ><span
                  style="
                    font-family: 'Wingdings 2';
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><font face="仿宋"
                    ><span class="checkbox"
                      ><i
                        v-if="detailBaseInfo.source === 5"
                        class="icon el-icon-check" /></span></font></span
                ><span
                  style="
                    font-family: 仿宋;
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><span style="font-family: 仿宋; mso-spacerun: 'yes'"
                    >&nbsp;&nbsp;&nbsp;&nbsp;</span
                  ><font face="仿宋">其他：</font></span
                ><span
                  style="
                    font-family: 仿宋;
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><font face="仿宋"
                    ><span class="checkbox"
                      ><i
                        v-if="
                          detailBaseInfo.source === 8 ||
                          detailBaseInfo.source === 6
                        "
                        class="icon el-icon-check" /></span></font
                ></span>
              </p>
            </td>
          </tr>
          <tr style="height: 21.2pt; page-break-inside: avoid">
            <td
              width="185"
              valign="center"
              colspan="5"
              style="
                width: 185.9pt;
                padding: 0pt 5.4pt 0pt 5.4pt;
                border-left: 1pt solid windowtext;
                mso-border-left-alt: 0.5pt solid windowtext;
                border-right: 1pt solid windowtext;
                mso-border-right-alt: 0.5pt solid windowtext;
                border-top: none;
                mso-border-top-alt: 0.5pt solid windowtext;
                border-bottom: 1pt solid windowtext;
                mso-border-bottom-alt: 0.5pt solid windowtext;
              "
            >
              <p class="MsoNormal" align="center" style="text-align: center">
                <span
                  style="
                    font-family: 仿宋;
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><font face="仿宋">是否本公司职员介绍，如有请说明</font></span
                ><span
                  style="
                    font-family: 仿宋;
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><span
                /></span>
              </p>
            </td>
            <td
              width="299"
              valign="center"
              colspan="8"
              style="
                width: 299.1pt;
                padding: 0pt 5.4pt 0pt 5.4pt;
                border-left: none;
                mso-border-left-alt: none;
                border-right: 1pt solid windowtext;
                mso-border-right-alt: 0.5pt solid windowtext;
                border-top: none;
                mso-border-top-alt: 0.5pt solid windowtext;
                border-bottom: 1pt solid windowtext;
                mso-border-bottom-alt: 0.5pt solid windowtext;
              "
            >
              <p class="MsoNormal" align="center" style="text-align: center">
                <span
                  style="
                    font-family: 仿宋;
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><font face="仿宋">姓名：</font></span
                >
                <u
                  ><span
                    style="
                      font-family: 仿宋;
                      text-decoration: underline;
                      text-underline: single;
                      font-size: 10.5pt;
                      mso-font-kerning: 1pt;
                    "
                    ><span style="font-family: 仿宋; mso-spacerun: 'yes'"
                      >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
                    ></span
                  ></u
                >
                <u
                  ><span
                    style="
                      font-family: 仿宋;
                      text-decoration: underline;
                      text-underline: single;
                      font-size: 10.5pt;
                      mso-font-kerning: 1pt;
                    "
                    ><span
                      v-if="detailBaseInfo.source === 6"
                      style="mso-spacerun: 'yes'"
                      >{{ detailBaseInfo.internalReferrerName }}</span
                    ></span
                  ></u
                >
                <u
                  ><span
                    style="
                      font-family: 仿宋;
                      text-decoration: underline;
                      text-underline: single;
                      font-size: 10.5pt;
                      mso-font-kerning: 1pt;
                    "
                    ><span style="font-family: 仿宋; mso-spacerun: 'yes'"
                      >&nbsp;&nbsp;&nbsp;&nbsp;</span
                    ></span
                  ></u
                >
                <span
                  style="
                    font-family: 仿宋;
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><span style="font-family: 仿宋; mso-spacerun: 'yes'"
                    >&nbsp;&nbsp;</span
                  ><font face="仿宋">部门：</font></span
                >
                <u
                  ><span
                    style="
                      font-family: 仿宋;
                      text-decoration: underline;
                      text-underline: single;
                      font-size: 10.5pt;
                      mso-font-kerning: 1pt;
                    "
                    ><span style="font-family: 仿宋; mso-spacerun: 'yes'"
                      >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
                    ></span
                  ></u
                >
                <u
                  ><span
                    style="
                      font-family: 仿宋;
                      text-decoration: underline;
                      text-underline: single;
                      font-size: 10.5pt;
                      mso-font-kerning: 1pt;
                    "
                    ><span
                      v-if="detailBaseInfo.source === 6"
                      style="mso-spacerun: 'yes'"
                      >{{ detailBaseInfo.internalReferrerDeptName }}</span
                    ></span
                  ></u
                >
              </p>
            </td>
          </tr>
          <tr style="height: 25.1pt; page-break-inside: avoid">
            <td
              width="485"
              valign="center"
              colspan="13"
              style="
                width: 485pt;
                padding: 0pt 5.4pt 0pt 5.4pt;
                border-left: 1pt solid windowtext;
                mso-border-left-alt: 0.5pt solid windowtext;
                border-right: 1pt solid windowtext;
                mso-border-right-alt: 0.5pt solid windowtext;
                border-top: none;
                mso-border-top-alt: 0.5pt solid windowtext;
                border-bottom: 1pt solid windowtext;
                mso-border-bottom-alt: 0.5pt solid windowtext;
                background: rgb(230, 230, 230);
              "
            >
              <p
                class="MsoNormal"
                align="center"
                style="
                  text-align: center;
                  line-height: 17pt;
                  mso-line-height-rule: exactly;
                "
              >
                <span
                  style="
                    font-family: 仿宋;
                    font-size: 14pt;
                    mso-font-kerning: 1pt;
                  "
                  ><font face="仿宋">工作及学习经历</font></span
                ><span
                  style="
                    font-family: 仿宋;
                    font-size: 14pt;
                    mso-font-kerning: 1pt;
                  "
                  ><span
                /></span>
              </p>
            </td>
          </tr>
          <tr style="height: 21.2pt">
            <td
              width="43"
              valign="center"
              :rowspan="
                detailBaseInfo.workExperienceList
                  ? detailBaseInfo.workExperienceList.length + 1
                  : 2
              "
              style="
                width: 43.2pt;
                padding: 0pt 5.4pt 0pt 5.4pt;
                border-left: 1pt solid windowtext;
                mso-border-left-alt: 0.5pt solid windowtext;
                border-right: 1pt solid windowtext;
                mso-border-right-alt: 0.5pt solid windowtext;
                border-top: none;
                mso-border-top-alt: none;
                border-bottom: 1pt dotted windowtext;
                mso-border-bottom-alt: 0.5pt dotted windowtext;
              "
            >
              <p class="MsoNormal" align="center" style="text-align: center">
                <span
                  style="
                    font-family: 仿宋;
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><font face="仿宋">主要工作经历</font></span
                ><span
                  style="
                    font-family: 仿宋;
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><span
                /></span>
              </p>
            </td>
            <td
              width="73"
              valign="center"
              colspan="2"
              style="
                width: 73.2pt;
                padding: 0pt 5.4pt 0pt 5.4pt;
                border-left: none;
                mso-border-left-alt: none;
                border-right: 1pt solid windowtext;
                mso-border-right-alt: 0.5pt solid windowtext;
                border-top: 1pt solid windowtext;
                mso-border-top-alt: 0.5pt solid windowtext;
                border-bottom: 1pt solid windowtext;
                mso-border-bottom-alt: 0.5pt solid windowtext;
              "
            >
              <p class="MsoNormal" align="center" style="text-align: center">
                <span
                  style="
                    font-family: 仿宋;
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><font face="仿宋">起止年月</font></span
                ><span
                  style="
                    font-family: 仿宋;
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><span
                /></span>
              </p>
            </td>
            <td
              width="132"
              valign="center"
              colspan="4"
              style="
                width: 132.5pt;
                padding: 0pt 5.4pt 0pt 5.4pt;
                border-left: none;
                mso-border-left-alt: none;
                border-right: 1pt solid windowtext;
                mso-border-right-alt: 0.5pt solid windowtext;
                border-top: 1pt solid windowtext;
                mso-border-top-alt: 0.5pt solid windowtext;
                border-bottom: 1pt solid windowtext;
                mso-border-bottom-alt: 0.5pt solid windowtext;
              "
            >
              <p class="MsoNormal" align="center" style="text-align: center">
                <span
                  style="
                    font-family: 仿宋;
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><font face="仿宋">工作单位名称</font></span
                ><span
                  style="
                    font-family: 仿宋;
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><span
                /></span>
              </p>
            </td>
            <td
              width="56"
              valign="center"
              colspan="2"
              style="
                width: 56.75pt;
                padding: 0pt 5.4pt 0pt 5.4pt;
                border-left: none;
                mso-border-left-alt: none;
                border-right: 1pt solid windowtext;
                mso-border-right-alt: 0.5pt solid windowtext;
                border-top: 1pt solid windowtext;
                mso-border-top-alt: 0.5pt solid windowtext;
                border-bottom: 1pt solid windowtext;
                mso-border-bottom-alt: 0.5pt solid windowtext;
              "
            >
              <p class="MsoNormal" align="center" style="text-align: center">
                <span
                  style="
                    font-family: 仿宋;
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><font face="仿宋">岗位</font></span
                ><span
                  style="
                    font-family: 仿宋;
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><span
                /></span>
              </p>
            </td>
            <td
              width="58"
              valign="center"
              colspan="3"
              style="
                width: 58.7pt;
                padding: 0pt 5.4pt 0pt 5.4pt;
                border-left: none;
                mso-border-left-alt: none;
                border-right: 1pt solid windowtext;
                mso-border-right-alt: 0.5pt solid windowtext;
                border-top: 1pt solid windowtext;
                mso-border-top-alt: 0.5pt solid windowtext;
                border-bottom: 1pt solid windowtext;
                mso-border-bottom-alt: 0.5pt solid windowtext;
              "
            >
              <p class="MsoNormal" align="center" style="text-align: center">
                <span
                  style="
                    font-family: 仿宋;
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><font face="仿宋">待遇</font></span
                ><span
                  style="
                    font-family: 仿宋;
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><span
                /></span>
              </p>
            </td>
            <td
              width="120"
              valign="center"
              style="
                width: 120.65pt;
                padding: 0pt 5.4pt 0pt 5.4pt;
                border-left: none;
                mso-border-left-alt: none;
                border-right: 1pt solid windowtext;
                mso-border-right-alt: 0.5pt solid windowtext;
                border-top: 1pt solid windowtext;
                mso-border-top-alt: 0.5pt solid windowtext;
                border-bottom: 1pt solid windowtext;
                mso-border-bottom-alt: 0.5pt solid windowtext;
              "
            >
              <p class="MsoNormal" align="center" style="text-align: center">
                <span
                  style="
                    font-family: 仿宋;
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><font face="仿宋">证明人及联系方式</font></span
                ><span
                  style="
                    font-family: 仿宋;
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><span
                /></span>
              </p>
            </td>
          </tr>
          <template v-for="item in detailBaseInfo.workExperienceList">
            <tr style="height: 24.4pt">
              <td
                width="73"
                valign="center"
                colspan="2"
                style="
                  width: 73.2pt;
                  padding: 0pt 5.4pt 0pt 5.4pt;
                  border-left: none;
                  mso-border-left-alt: none;
                  border-right: 1pt solid windowtext;
                  mso-border-right-alt: 0.5pt solid windowtext;
                  border-top: none;
                  mso-border-top-alt: 0.5pt solid windowtext;
                  border-bottom: 1pt solid windowtext;
                  mso-border-bottom-alt: 0.5pt solid windowtext;
                "
              >
                <p class="MsoNormal" align="center" style="text-align: center">
                  <span
                    style="
                      font-family: 仿宋;
                      font-size: 10.5pt;
                      mso-font-kerning: 1pt;
                    "
                    ><span
                      >{{ getTime(item.entryTime) }}

                      {{ getTime(item.departureTime) }}</span
                    ></span
                  >
                </p>
              </td>
              <td
                width="132"
                valign="center"
                colspan="4"
                style="
                  width: 132.5pt;
                  padding: 0pt 5.4pt 0pt 5.4pt;
                  border-left: none;
                  mso-border-left-alt: none;
                  border-right: 1pt solid windowtext;
                  mso-border-right-alt: 0.5pt solid windowtext;
                  border-top: none;
                  mso-border-top-alt: 0.5pt solid windowtext;
                  border-bottom: 1pt solid windowtext;
                  mso-border-bottom-alt: 0.5pt solid windowtext;
                "
              >
                <p class="MsoNormal" align="center" style="text-align: center">
                  <span
                    style="
                      font-family: 仿宋;
                      font-size: 10.5pt;
                      mso-font-kerning: 1pt;
                    "
                    ><span>{{ item.companyName }}</span></span
                  >
                </p>
              </td>
              <td
                width="56"
                valign="center"
                colspan="2"
                style="
                  width: 56.75pt;
                  padding: 0pt 5.4pt 0pt 5.4pt;
                  border-left: none;
                  mso-border-left-alt: none;
                  border-right: 1pt solid windowtext;
                  mso-border-right-alt: 0.5pt solid windowtext;
                  border-top: none;
                  mso-border-top-alt: 0.5pt solid windowtext;
                  border-bottom: 1pt solid windowtext;
                  mso-border-bottom-alt: 0.5pt solid windowtext;
                "
              >
                <p class="MsoNormal" align="center" style="text-align: center">
                  <span
                    style="
                      font-family: 仿宋;
                      font-size: 10.5pt;
                      mso-font-kerning: 1pt;
                    "
                    ><span>{{ item.positionName }}</span></span
                  >
                </p>
              </td>
              <td
                width="58"
                valign="center"
                colspan="3"
                style="
                  width: 58.7pt;
                  padding: 0pt 5.4pt 0pt 5.4pt;
                  border-left: none;
                  mso-border-left-alt: none;
                  border-right: 1pt solid windowtext;
                  mso-border-right-alt: 0.5pt solid windowtext;
                  border-top: none;
                  mso-border-top-alt: 0.5pt solid windowtext;
                  border-bottom: 1pt solid windowtext;
                  mso-border-bottom-alt: 0.5pt solid windowtext;
                "
              >
                <p class="MsoNormal" align="center" style="text-align: center">
                  <span
                    style="
                      font-family: 仿宋;
                      font-size: 10.5pt;
                      mso-font-kerning: 1pt;
                    "
                    ><span>{{ item.treatment }}</span></span
                  >
                </p>
              </td>
              <td
                width="120"
                valign="center"
                style="
                  width: 120.65pt;
                  padding: 0pt 5.4pt 0pt 5.4pt;
                  border-left: none;
                  mso-border-left-alt: none;
                  border-right: 1pt solid windowtext;
                  mso-border-right-alt: 0.5pt solid windowtext;
                  border-top: none;
                  mso-border-top-alt: 0.5pt solid windowtext;
                  border-bottom: 1pt solid windowtext;
                  mso-border-bottom-alt: 0.5pt solid windowtext;
                "
              >
                <p class="MsoNormal" align="center" style="text-align: center">
                  <span
                    style="
                      font-family: 仿宋;
                      font-size: 10.5pt;
                      mso-font-kerning: 1pt;
                    "
                    ><span
                      >{{ item.witness }} {{ item.witnessPhone }}</span
                    ></span
                  >
                </p>
              </td>
            </tr>
          </template>
          <tr style="height: 21.8pt">
            <td
              width="43"
              valign="center"
              :rowspan="
                detailBaseInfo.educationExperienceList
                  ? detailBaseInfo.educationExperienceList.length + 1
                  : 2
              "
              style="
                width: 43.2pt;
                padding: 0pt 5.4pt 0pt 5.4pt;
                border-left: 1pt solid windowtext;
                mso-border-left-alt: 0.5pt solid windowtext;
                border-right: 1pt solid windowtext;
                mso-border-right-alt: 0.5pt solid windowtext;
                border-top: 1pt dotted windowtext;
                mso-border-top-alt: 0.5pt dotted windowtext;
                border-bottom: 1pt dotted windowtext;
                mso-border-bottom-alt: 0.5pt dotted windowtext;
              "
            >
              <p class="MsoNormal" align="center" style="text-align: center">
                <span
                  style="
                    font-family: 仿宋;
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><font face="仿宋">教育培训经历</font></span
                ><span
                  style="
                    font-family: 仿宋;
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><span
                /></span>
              </p>
            </td>
            <td
              width="73"
              valign="center"
              colspan="2"
              style="
                width: 73.2pt;
                padding: 0pt 5.4pt 0pt 5.4pt;
                border-left: none;
                mso-border-left-alt: none;
                border-right: 1pt solid windowtext;
                mso-border-right-alt: 0.5pt solid windowtext;
                border-top: 1pt dotted windowtext;
                mso-border-top-alt: 0.5pt dotted windowtext;
                border-bottom: 1pt solid windowtext;
                mso-border-bottom-alt: 0.5pt solid windowtext;
              "
            >
              <p class="MsoNormal" align="center" style="text-align: center">
                <span
                  style="
                    font-family: 仿宋;
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><font face="仿宋">起止年月</font></span
                ><span
                  style="
                    font-family: 仿宋;
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><span
                /></span>
              </p>
            </td>
            <td
              width="132"
              valign="center"
              colspan="4"
              style="
                width: 132.5pt;
                padding: 0pt 5.4pt 0pt 5.4pt;
                border-left: none;
                mso-border-left-alt: none;
                border-right: 1pt solid windowtext;
                mso-border-right-alt: 0.5pt solid windowtext;
                border-top: 1pt dotted windowtext;
                mso-border-top-alt: 0.5pt dotted windowtext;
                border-bottom: 1pt solid windowtext;
                mso-border-bottom-alt: 0.5pt solid windowtext;
              "
            >
              <p class="MsoNormal" align="center" style="text-align: center">
                <span
                  style="
                    font-family: 仿宋;
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><font face="仿宋">学校</font
                  ><font face="仿宋">/培训机构名称</font></span
                ><span
                  style="
                    font-family: 仿宋;
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><span
                /></span>
              </p>
            </td>
            <td
              width="115"
              valign="center"
              colspan="5"
              style="
                width: 115.45pt;
                padding: 0pt 5.4pt 0pt 5.4pt;
                border-left: none;
                mso-border-left-alt: none;
                border-right: 1pt solid windowtext;
                mso-border-right-alt: 0.5pt solid windowtext;
                border-top: 1pt dotted windowtext;
                mso-border-top-alt: 0.5pt dotted windowtext;
                border-bottom: 1pt solid windowtext;
                mso-border-bottom-alt: 0.5pt solid windowtext;
              "
            >
              <p class="MsoNormal" align="center" style="text-align: center">
                <span
                  style="
                    font-family: 仿宋;
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><font face="仿宋">专业</font></span
                ><span
                  style="
                    font-family: 仿宋;
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><span
                /></span>
              </p>
            </td>
            <td
              width="120"
              valign="center"
              style="
                width: 120.65pt;
                padding: 0pt 5.4pt 0pt 5.4pt;
                border-left: none;
                mso-border-left-alt: none;
                border-right: 1pt solid windowtext;
                mso-border-right-alt: 0.5pt solid windowtext;
                border-top: 1pt dotted windowtext;
                mso-border-top-alt: 0.5pt dotted windowtext;
                border-bottom: 1pt solid windowtext;
                mso-border-bottom-alt: 0.5pt solid windowtext;
              "
            >
              <p class="MsoNormal" align="center" style="text-align: center">
                <span
                  style="
                    font-family: 仿宋;
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><font face="仿宋">毕（肄）、结业</font></span
                ><span
                  style="
                    font-family: 仿宋;
                    font-size: 10.5pt;
                    mso-font-kerning: 1pt;
                  "
                  ><span
                /></span>
              </p>
            </td>
          </tr>
          <template v-for="item in detailBaseInfo.educationExperienceList">
            <tr style="height: 27.35pt">
              <td
                width="73"
                valign="center"
                colspan="2"
                style="
                  width: 73.2pt;
                  padding: 0pt 5.4pt 0pt 5.4pt;
                  border-left: none;
                  mso-border-left-alt: none;
                  border-right: 1pt solid windowtext;
                  mso-border-right-alt: 0.5pt solid windowtext;
                  border-top: none;
                  mso-border-top-alt: 0.5pt solid windowtext;
                  border-bottom: 1pt solid windowtext;
                  mso-border-bottom-alt: 0.5pt solid windowtext;
                "
              >
                <p class="MsoNormal" align="center" style="text-align: center">
                  <span
                    style="
                      font-family: 仿宋;
                      font-size: 10.5pt;
                      mso-font-kerning: 1pt;
                    "
                    ><span
                      >{{ getTime(item.entryTime) }}
                      {{ getTime(item.graduationTime) }}</span
                    ></span
                  >
                </p>
              </td>
              <td
                width="132"
                valign="center"
                colspan="4"
                style="
                  width: 132.5pt;
                  padding: 0pt 5.4pt 0pt 5.4pt;
                  border-left: none;
                  mso-border-left-alt: none;
                  border-right: 1pt solid windowtext;
                  mso-border-right-alt: 0.5pt solid windowtext;
                  border-top: none;
                  mso-border-top-alt: 0.5pt solid windowtext;
                  border-bottom: 1pt solid windowtext;
                  mso-border-bottom-alt: 0.5pt solid windowtext;
                "
              >
                <p class="MsoNormal" align="center" style="text-align: center">
                  <span
                    style="
                      font-family: 仿宋;
                      font-size: 10.5pt;
                      mso-font-kerning: 1pt;
                    "
                    ><span>{{ item.schoolName }}</span></span
                  >
                </p>
              </td>
              <td
                width="115"
                valign="center"
                colspan="5"
                style="
                  width: 115.45pt;
                  padding: 0pt 5.4pt 0pt 5.4pt;
                  border-left: none;
                  mso-border-left-alt: none;
                  border-right: 1pt solid windowtext;
                  mso-border-right-alt: 0.5pt solid windowtext;
                  border-top: none;
                  mso-border-top-alt: 0.5pt solid windowtext;
                  border-bottom: 1pt solid windowtext;
                  mso-border-bottom-alt: 0.5pt solid windowtext;
                "
              >
                <p class="MsoNormal" align="center" style="text-align: center">
                  <span
                    style="
                      font-family: 仿宋;
                      font-size: 10.5pt;
                      mso-font-kerning: 1pt;
                    "
                    ><span>{{ item.major }}</span></span
                  >
                </p>
              </td>
              <td
                width="120"
                valign="center"
                style="
                  width: 120.65pt;
                  padding: 0pt 5.4pt 0pt 5.4pt;
                  border-left: none;
                  mso-border-left-alt: none;
                  border-right: 1pt solid windowtext;
                  mso-border-right-alt: 0.5pt solid windowtext;
                  border-top: none;
                  mso-border-top-alt: 0.5pt solid windowtext;
                  border-bottom: 1pt solid windowtext;
                  mso-border-bottom-alt: 0.5pt solid windowtext;
                "
              >
                <p class="MsoNormal" align="center" style="text-align: center">
                  <span
                    style="
                      font-family: 仿宋;
                      font-size: 10.5pt;
                      mso-font-kerning: 1pt;
                    "
                    ><span>{{
                      academicStatusMap[item.academicStatus]
                    }}</span></span
                  >
                </p>
              </td>
            </tr>
          </template>

          <tr style="height: 80pt">
            <td
              width="485"
              valign="center"
              colspan="13"
              style="
                width: 485pt;
                padding: 0pt 5.4pt 0pt 5.4pt;
                border-left: 1pt solid windowtext;
                mso-border-left-alt: 0.5pt solid windowtext;
                border-right: 1pt solid windowtext;
                mso-border-right-alt: 0.5pt solid windowtext;
                border-top: 1pt solid windowtext;
                mso-border-top-alt: 0.5pt solid windowtext;
                border-bottom: 1pt solid windowtext;
                mso-border-bottom-alt: 0.5pt solid windowtext;
              "
            >
              <p
                class="MsoNormal"
                align="center"
                style="
                  text-indent: 22.1pt;
                  mso-char-indent-count: 2;
                  text-align: center;
                  line-height: 150%;
                "
              >
                <b
                  ><span
                    style="
                      font-family: 仿宋;
                      font-weight: bold;
                      font-size: 11pt;
                      mso-font-kerning: 1pt;
                    "
                    ><font face="仿宋"
                      >1、以往是否存在劳动仲裁、司法诉讼？ 劳动仲裁
                    </font></span
                  ></b
                ><b
                  ><span
                    style="
                      font-family: 'Wingdings 2';
                      font-weight: bold;
                      font-size: 11pt;
                      mso-font-kerning: 1pt;
                    "
                    ><font face="仿宋"
                      ><span class="checkbox"
                        ><i
                          v-if="isArbitration('1')"
                          class="icon el-icon-check"
                          style="
                            transform: translate(-85%, -50%);
                          " /></span></font></span></b
                ><b
                  ><span
                    style="
                      font-family: 仿宋;
                      font-weight: bold;
                      font-size: 11pt;
                      mso-font-kerning: 1pt;
                    "
                    ><span style="font-family: 仿宋; mso-spacerun: 'yes'"
                      >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
                    ><font face="仿宋">司法诉讼</font>
                  </span></b
                ><b
                  ><span
                    style="
                      font-family: 'Wingdings 2';
                      font-weight: bold;
                      font-size: 11pt;
                      mso-font-kerning: 1pt;
                    "
                    ><font face="仿宋"
                      ><span class="checkbox"
                        ><i
                          v-if="isArbitration('2')"
                          class="icon el-icon-check"
                          style="
                            transform: translate(-85%, -50%);
                          " /></span></font></span></b
                ><b
                  ><span
                    style="
                      font-family: 仿宋;
                      font-weight: bold;
                      font-size: 11pt;
                      mso-font-kerning: 1pt;
                    "
                    ><span style="font-family: 仿宋; mso-spacerun: 'yes'"
                      >&nbsp;&nbsp;&nbsp;</span
                    ><font face="仿宋">无</font>
                  </span></b
                ><b
                  ><span
                    style="
                      font-family: 'Wingdings 2';
                      font-weight: bold;
                      font-size: 11pt;
                      mso-font-kerning: 1pt;
                    "
                    ><font face="仿宋"
                      ><span class="checkbox"
                        ><i
                          v-if="isArbitration('3')"
                          class="icon el-icon-check"
                          style="
                            transform: translate(-85%, -70%);
                          " /></span></font></span></b
                ><b
                  ><span
                    style="
                      font-family: 仿宋;
                      font-weight: bold;
                      font-size: 11pt;
                      mso-font-kerning: 1pt;
                    "
                    ><span /></span
                ></b>
              </p>
              <p
                class="MsoNormal"
                align="center"
                style="
                  text-indent: 22.1pt;
                  mso-char-indent-count: 2;
                  text-align: center;
                  line-height: 250%;
                  margin: 2em 0;
                "
              >
                <b
                  ><span
                    style="
                      font-family: 仿宋;
                      font-weight: bold;
                      font-size: 11pt;
                      mso-font-kerning: 1pt;
                    "
                    ><font face="仿宋"
                      >2、声明：本人自愿向获客文化提供以上信息，并在此声明涉及本表所填内容均遵守诚实信用原则，如有虚假或误解，本人确认获客文化有权拒绝录用或解雇本人，本人放弃全部权利主张。公司声明：如果本次您暂未被录用，公司承诺将对您的资料保密，存入公司人才库，在缺岗时随时可能与您联系，绝不提供给第三方用作任何商业目的。如果录用，本表作为您档案的一部分。</font
                    ></span
                  ></b
                ><b
                  ><span
                    style="
                      font-family: 仿宋;
                      font-weight: bold;
                      font-size: 11pt;
                      mso-font-kerning: 1pt;
                    "
                    ><span /></span
                ></b>
              </p>

              <div
                align="center"
                style="
                  margin-right: 21pt;
                  text-indent: 22.1pt;
                  mso-char-indent-count: 2;
                  text-align: center;
                  line-height: 150%;
                "
              >
                <div style="display: inline-flex; align-items: center">
                  <b
                    ><span
                      style="
                        font-family: 仿宋;
                        font-weight: bold;
                        font-size: 11pt;
                        mso-font-kerning: 1pt;
                      "
                      ><font face="仿宋">应聘者本人签名：</font></span
                    ></b
                  >
                  <b
                    ><u
                      ><span
                        style="
                          font-family: 仿宋;
                          font-weight: bold;
                          text-decoration: underline;
                          text-underline: single;
                          font-size: 11pt;
                          mso-font-kerning: 1pt;
                        "
                        ><span
                          v-if="detailBaseInfo.signatureUrl"
                          style="font-family: 仿宋; mso-spacerun: 'yes'"
                          ><img
                            crossorigin="anonymous"
                            style="width: 100px"
                            :src="detailBaseInfo.signatureUrl"
                            alt="无法显示" /></span></span></u
                  ></b>
                </div>
                <div style="display: inline-block">
                  <b
                    ><span
                      style="
                        font-family: 仿宋;
                        font-weight: bold;
                        font-size: 11pt;
                        mso-font-kerning: 1pt;
                      "
                      ><font face="仿宋">日期：</font></span
                    ></b
                  >
                  <u
                    ><span
                      style="
                        font-family: 仿宋;
                        text-decoration: underline;
                        text-underline: single;
                        font-size: 10.5pt;
                        mso-font-kerning: 1pt;
                      "
                      ><span style="font-family: 仿宋; mso-spacerun: 'yes'">{{
                        getTime(detailBaseInfo.submitTime)
                      }}</span></span
                    ></u
                  >
                </div>
              </div>
            </td>
          </tr>
        </table>

        <p
          class="MsoNormal"
          align="justify"
          style="text-align: justify; text-justify: inter-ideograph"
        >
          <span
            style="
              mso-spacerun: 'yes';
              font-family: 仿宋;
              font-size: 10.5pt;
              mso-font-kerning: 1pt;
            "
            ><span
          /></span>
        </p>
      </div>
      <!--EndFragment-->
    </div>
    <div class="button-box">
      <el-button
        type="primary"
        size="default"
        @click="capture"
        :loading="loading"
        >下 载</el-button
      >
    </div>
  </div>
</template>

<script>
import { queryRegistrationBaseInfo } from '@/api/businessAdmin/talentFile'
import html2canvas from 'html2canvas'
import './html2canvas'
import moment from 'moment'
import { educationTypeMap } from './options'
export default {
  props: {
    personnelInfoId: {
      type: String,
      default: ''
    },
    height: {
      type: String,
      default: '700px'
    }
  },
  data() {
    return {
      detailBaseInfo: {},
      maritalStatusMap: {
        0: '未婚',
        1: '已婚',
        2: '其他'
      },
      academicStatusMap: {
        0: '毕业',
        1: '结业',
        2: '肄业'
      },
      loading: false,
      educationTypeMap
    }
  },
  mounted() {
    this.getRegistrationBaseInfo(this.personnelInfoId)
  },
  methods: {
    capture() {
      this.loading = true
      // 获取要转换的 HTML 元素
      const element = document.getElementById('registration')
      setTimeout(() => {
        // 使用 html2canvas 将元素转换为 canvas
        html2canvas(element, {
          allowTaint: true,
          useCORS: true,
          scale: 2
        })
          .then(canvas => {
            // 创建一个图片对象并设置图片数据为 canvas 的数据
            const imgData = canvas.toDataURL('image/png')

            // 创建一个链接元素并设置下载属性，将图片数据链接赋值给 href
            const link = document.createElement('a')
            link.download = '面试登记表.png'
            link.href = imgData

            // 将链接元素插入到文档中并触发点击
            document.body.appendChild(link)
            link.click()

            // 删除链接元素
            document.body.removeChild(link)
            this.loading = false
          })
          .catch(() => {
            this.loading = false
          })
      }, 100)
    },
    isArbitration(val) {
      return this.detailBaseInfo.arbitrationList
        ? this.detailBaseInfo.arbitrationList.includes(val)
        : false
    },
    getTime(time) {
      return time ? moment(time).format('YYYY-MM-DD') : ''
    },
    async getRegistrationBaseInfo(personnelInfoId) {
      const params = {
        personnelInfoId: personnelInfoId || this.$route.query.personnelInfoId
      }

      const res = await queryRegistrationBaseInfo(params)

      this.detailBaseInfo = res.data
    }
  }
}
</script>

<style style="scss" scoped>
.button-box {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
}

.checkbox {
  display: inline-block;
  width: 15px;
  height: 15px;
  position: relative;
  top: 0.5px;
  border: 1px solid #000;
  margin-left: 5px;
  vertical-align: bottom;
}

.icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -70%);
  font-weight: 700;
}

@font-face {
  font-family: 'Times New Roman';
}

@font-face {
  font-family: '宋体';
}

@font-face {
  font-family: 'Wingdings';
}

@font-face {
  font-family: '仿宋';
}

@font-face {
  font-family: 'Wingdings 2';
}

p.MsoNormal {
  mso-style-name: 正文;
  mso-style-parent: '';
  margin: 0pt;
  margin-bottom: 0.0001pt;
  mso-pagination: none;
  text-align: justify;
  text-justify: inter-ideograph;
  font-family: 'Times New Roman';
  font-size: 10.5pt;
  mso-font-kerning: 1pt;
}

span.10 {
  font-family: 'Times New Roman';
}

span.15 {
  font-family: 仿宋;
  color: rgb(0, 0, 0);
  font-style: normal;
  font-size: 11pt;
}

span.16 {
  font-family: 仿宋;
  color: rgb(0, 0, 0);
  font-style: normal;
  font-size: 24pt;
}

span.17 {
  font-family: 仿宋;
  color: rgb(0, 0, 0);
  font-style: normal;
  font-size: 11pt;
}

span.18 {
  font-family: 仿宋;
  color: rgb(0, 0, 0);
  font-style: normal;
  font-size: 12pt;
}

span.19 {
  font-family: 宋体;
  color: rgb(0, 0, 0);
  font-style: normal;
  font-size: 11pt;
}

p.MsoHeader {
  mso-style-name: 页眉;
  margin: 0pt;
  margin-bottom: 0.0001pt;
  border-bottom: 1pt solid windowtext;
  mso-border-bottom-alt: 0.75pt solid windowtext;
  padding: 0pt 0pt 1pt 0pt;
  layout-grid-mode: char;
  mso-pagination: none;
  text-align: center;
  font-family: 'Times New Roman';
  font-size: 9pt;
  mso-font-kerning: 1pt;
}

p.MsoFooter {
  mso-style-name: 页脚;
  margin: 0pt;
  margin-bottom: 0.0001pt;
  layout-grid-mode: char;
  mso-pagination: none;
  text-align: left;
  font-family: 'Times New Roman';
  font-size: 9pt;
  mso-font-kerning: 1pt;
}

span.msoIns {
  mso-style-type: export-only;
  mso-style-name: '';
  text-decoration: underline;
  text-underline: single;
  color: blue;
}

span.msoDel {
  mso-style-type: export-only;
  mso-style-name: '';
  text-decoration: line-through;
  color: red;
}

table.MsoNormalTable {
  mso-style-name: 普通表格;
  mso-style-parent: '';
  mso-style-noshow: yes;
  mso-tstyle-rowband-size: 0;
  mso-tstyle-colband-size: 0;
  mso-padding-alt: 0pt 5.4pt 0pt 5.4pt;
  mso-para-margin: 0pt;
  mso-para-margin-bottom: 0.0001pt;
  mso-pagination: widow-orphan;
  font-family: 'Times New Roman';
  font-size: 10pt;
  mso-ansi-language: #0400;
  mso-fareast-language: #0400;
  mso-bidi-language: #0400;
}
@page {
  mso-page-border-surround-header: no;
  mso-page-border-surround-footer: no;
}
@page Section0 {
  margin-top: 18.45pt;
  margin-bottom: 15.6pt;
  margin-left: 56.7pt;
  margin-right: 56.7pt;
  size: 595.3pt 841.9pt;
  layout-grid: 15.6pt;
  mso-header-margin: 42.55pt;
  mso-footer-margin: 28.35pt;
  /* mso-first-header: url('获客应聘人员登记表（空白）.files/header.html') fh0; */
}
div.Section0 {
  page: Section0;
}
@page Section1 {
  margin-top: 18.45pt;
  margin-bottom: 15.6pt;
  margin-left: 56.7pt;
  margin-right: 56.7pt;
  size: 595.3pt 841.9pt;
  layout-grid: 15.6pt;
  mso-header-margin: 42.55pt;
  mso-footer-margin: 28.35pt;
  /* mso-first-header: url('获客应聘人员登记表（空白）.files/header.html') fh0; */
}
div.Section1 {
  page: Section1;
}
</style>
