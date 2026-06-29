---
title: "Java对Excel的相关操作"
published: 2026-06-29
description: "Excel相关 1、全自定义单元格格式导出excel 创建相关的excel文件:XSSFWorkbook workbook = new XSSFWorkbook ; sheet名称设置 可多个sheet :Sheet sheet = workbook.createSheet ; "
image: ""
tags: ["Java"]
category: "开发笔记"
draft: false
lang: "zh-CN"
---

# Excel相关

## 1、全自定义单元格格式导出excel

-

    创建相关的excel文件:XSSFWorkbook workbook = new XSSFWorkbook();

-

    sheet名称设置(可多个sheet):Sheet sheet = workbook.createSheet();

-

    根据sheet名称单独设计表格(有一定的先后顺序):
    1. 创建行(从0开始):Row row0 = sheet.createRow(0);
    (每一行都是独立的,需要单独创建,且不可多次创建)
    2.合并所需的单元格:
    CellRangeAddress mergedRegion = new  CellRangeAddress(起始行, 结束行, 起始列, 结束列);
    sheet.addMergedRegion(mergedRegion);
    3.单独创建单元格(相当于列,创建行是前提条件,也是从0开始):

    Cell cell = row0.createCell(0);

    4.根据所需要的逻辑在对应的位置依次插入数据:
    cell.setCellValue(具体数值);
    5.Tips:各种操作必须按行!!!

    public String labourAttendanceDetailListExport(Map<String, Object> parameter) throws Exception {
    String startTime = parameter.get("startTime").toString();
    String endTime = parameter.get("endTime").toString();
    LabourBaseReq labourBaseReq = new LabourBaseReq();
    labourBaseReq.setProjectId(Long.valueOf(parameter.get("projectId").toString()));
    List<LabourBaseRes> labourBaseRes = labourBaseMapper.selectPageList(labourBaseReq);
    //标题头日期
    List<String> everyDay = null;
    try {
    everyDay = com.luban.common.utils.DateUtils.findEveryDay(startTime, endTime);
    } catch (Exception e) {
    throw new RuntimeException(e);
    }
    List<String> finalEveryDay = everyDay;
    XSSFWorkbook workbook = new XSSFWorkbook();
    //根据班组分租
    Map<Long, List<LabourBaseRes>> map = labourBaseRes.stream().collect(Collectors.groupingBy(LabourBaseRes::getOrganId));
    map.forEach((key, value) -> {
    //sheet名称设置
    Sheet sheet = workbook.createSheet(value.get(0).getProjectName() + "-" + value.get(0).getOrganName() + "-" + "考勤明细");
    //创建第0行
    Row sheetTitle = sheet.createRow(0);
    Cell sheetTitleCell = sheetTitle.createCell(0);
    //合并第0行相关的格子
    CellRangeAddress mergedRegion = new CellRangeAddress(0, 0, 0, 5 + finalEveryDay.size());
    sheet.addMergedRegion(mergedRegion);
    //标题插入
    sheetTitleCell.setCellValue(value.get(0).getEnterpriseName() + "-" + value.get(0).getProjectName() + "-" + value.get(0).getOrganName()
    + startTime + "~" + endTime);
    //创建第1行
    Row headerRow = sheet.createRow(1);
    //标题头设置
    List<String> sheetTitles = new ArrayList<>();
    sheetTitles.add("项目名称");
    sheetTitles.add("人员姓名");
    sheetTitles.add("班组");
    sheetTitles.add("工种");
    sheetTitles.add("类型");
    sheetTitles.add("日期");
    for (int i = 0; i < sheetTitles.size(); i) {
    Cell headerCell = headerRow.createCell(i);
    headerCell.setCellValue(sheetTitles.get(i));
    }
    //合并标题头两行
    for (int i = 0; i < 5; i) {
    CellRangeAddress mergedRegion2 = new CellRangeAddress(1, 2, i, i);
    sheet.addMergedRegion(mergedRegion2);
    }
    //日期合并
    CellRangeAddress mergedRegion1 = new CellRangeAddress(1, 1, 5, finalEveryDay.size() + 4);
    sheet.addMergedRegion(mergedRegion1);
    //创建第2行(日期)
    //日期插入
    Row dataRow = sheet.createRow(2);
    //列
    for (int j = 5; j < finalEveryDay.size() + 5; j) {
    Cell dataCell = dataRow.createCell(j);
    dataCell.setCellValue(finalEveryDay.get(j - 5));
    }
    //两个人以上的数据插入
    if (value.size() > 1) {
    int rowNum  = 3;
    for (LabourBaseRes item : value) {
    //创建第3行(上班时间)
    //合并数据标题两行
    Row workRow = sheet.createRow(rowNum);
    List<String> headTitle = new ArrayList<>();
    headTitle.add(item.getWorkerName());
    headTitle.add(item.getProjectName());
    headTitle.add(item.getOrganName());
    headTitle.add(item.getProfessionName());
    for (int i = 0; i < 4; i) {
    //列
    //数据插入
    Cell cell = workRow.createCell(i);
    cell.setCellValue(headTitle.get(i));
    }
    //合并这一行的相关数据
    for (int j = 0; j < 4; j++) {
    //列
    CellRangeAddress mergedRegion3 = new CellRangeAddress(rowNum, rowNum + 1, j, j);
    sheet.addMergedRegion(mergedRegion3);
    }
    //上下班打卡时间填充
    //获取数据
    List<String> workTime = new ArrayList<>();
    List<String> offWorkTime = new ArrayList<>();
    for (String temp : finalEveryDay) {
    Map<String, Object> param = new HashMap<>();
    param.put("labourId", item.getId());
    param.put("ioDirection", NumberConstants.ONE);
    param.put("time", temp);
    String time1 = labourIoRecordMapper.selectAttendanceTime(param);
    //上班时间
    if (Objects.isNull(time1)) {
    workTime.add("无");
    } else {
    workTime.add(time1.substring(11, 16));
    }
    param.put("ioDirection", NumberConstants.TWE);
    String time2 = labourIoRecordMapper.selectAttendanceTime(param);
    //下班时间
    if (Objects.isNull(time2) || Objects.equals(workTime.get(workTime.size() - 1), "0")) {
    offWorkTime.add("无");
    } else {
    offWorkTime.add(time2.substring(11, 16));
    }
    }
    //上下班时间及其对应的时间数据
    //上班行创建
    for (int j = 5; j < finalEveryDay.size() + 5; j++) {
    Cell workCell = workRow.createCell(4);
    workCell.setCellValue("上班时间");
    Cell dataCell1 = workRow.createCell(j);
    dataCell1.setCellValue(workTime.get(j - 5));
    }
    //创建第4行(下班行创建)
    Row offWorkRow = sheet.createRow(rowNum + 1);
    for (int j = 5; j < finalEveryDay.size() + 5; j++) {
    Cell offWorkCell = offWorkRow.createCell(4);
    offWorkCell.setCellValue("下班时间");
    Cell dataCell1 = offWorkRow.createCell(j);
    dataCell1.setCellValue(offWorkTime.get(j - 5));
    }
    rowNum = rowNum + 2;
    }
    } else {
    //创建第3行(上班时间)
    //合并数据标题两行
    Row workRow = sheet.createRow(3);
    List<String> headTitle = new ArrayList<>();
    headTitle.add(value.get(0).getWorkerName());
    headTitle.add(value.get(0).getProjectName());
    headTitle.add(value.get(0).getOrganName());
    headTitle.add(value.get(0).getProfessionName());
    for (int i = 0; i < 4; i) {
    //列
    //数据插入
    Cell cell = workRow.createCell(i);
    cell.setCellValue(headTitle.get(i));
    }
    //合并这一行的相关数据
    for (int j = 0; j < 4; j) {
    //列
    CellRangeAddress mergedRegion3 = new CellRangeAddress(3, 4, j, j);
    sheet.addMergedRegion(mergedRegion3);
    }
    //上下班打卡时间填充
    //获取数据
    List<String> workTime = new ArrayList<>();
    List<String> offWorkTime = new ArrayList<>();
    for (String temp : finalEveryDay) {
    Map<String, Object> param = new HashMap<>();
    param.put("labourId", value.get(0).getId());
    param.put("ioDirection", NumberConstants.ONE);
    param.put("time", temp);
    String time1 = labourIoRecordMapper.selectAttendanceTime(param);
    //上班时间
    if (Objects.isNull(time1)) {
    workTime.add("无");
    } else {
    workTime.add(time1.substring(11, 16));
    }
    param.put("ioDirection", NumberConstants.TWE);
    String time2 = labourIoRecordMapper.selectAttendanceTime(param);
    //下班时间
    if (Objects.isNull(time2) || Objects.equals(workTime.get(workTime.size() - 1), "0")) {
    offWorkTime.add("无");
    } else {
    offWorkTime.add(time2.substring(11, 16));
    }
    }
    //上下班时间及其对应的时间数据
    //上班行创建
    Cell workCell = workRow.createCell(4);
    workCell.setCellValue("上班时间");
    for (int j = 5; j < finalEveryDay.size() + 5; j++) {
    Cell dataCell1 = workRow.createCell(j);
    dataCell1.setCellValue(workTime.get(j - 5));
    }
    //创建第4行(下班行创建)
    Row offWorkRow = sheet.createRow(4);
    Cell offWorkCell = offWorkRow.createCell(4);
    offWorkCell.setCellValue("下班时间");
    for (int j = 5; j < finalEveryDay.size() + 5; j++) {
    Cell dataCell1 = offWorkRow.createCell(j);
    dataCell1.setCellValue(offWorkTime.get(j - 5));
    }
    }
    });
    File path = File.createTempFile("考勤明细", ".xlsx");
    ByteArrayOutputStream os = new ByteArrayOutputStream();
    try {
    workbook.write(os);
    } catch (IOException e) {
    e.printStackTrace();
    }
    byte[] content = os.toByteArray();
    File file = FileUtils.byteToFile(content, path.getPath());
    return MinIOUtil.upload(file, "labourAttendanceDetailListExport");
    }

## 2、excel样式设计
