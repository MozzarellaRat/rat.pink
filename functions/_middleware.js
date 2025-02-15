export async function onRequest(context) {
  const url = new URL(context.request.url);
  const as = context.request.cf.asn;
  console.log("hi! " + url.pathname);
  if (url.pathname.includes(".wrangler")) {
    return new Response("go fuck yourself.");
  }
  if (url.pathname == "/") {
    url.pathname = "/time.html"
    return context.env.ASSETS.fetch(url);
  }
  /*if (as === 10430 || as === 7922) {


  } else {
    console.log(as);
  }*/
  return context.env.ASSETS.fetch(url);
}
