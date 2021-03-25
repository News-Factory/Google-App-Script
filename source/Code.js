function onOpen(){
  showSidebar();
}

function showSidebar(){
  var html = HtmlService.createHtmlOutputFromFile('Sidebar')
      .setSandboxMode(HtmlService.SandboxMode.IFRAME)
      .setTitle('Sidebar')
      .setWidth(300);
  SpreadsheetApp.getUi().showSidebar(html);
}
