function redirecturl(url) {
  url += `/${document.querySelector("#usermny").innerHTML}`;
  window.location = url;
}
