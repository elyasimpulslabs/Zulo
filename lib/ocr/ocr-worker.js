/* Zulo Texterkennung für Fotos von Lohnabrechnungen.
   Läuft komplett auf dem Gerät. Das Bild wird nirgendwohin geschickt. */
let mod=null,api=null;
async function init(simd){
  if(api)return;
  importScripts(simd?"tesseract-core-simd-lstm.js":"tesseract-core-lstm.js");
  mod=await TesseractCore();
  const r=await fetch("deu.traineddata",{credentials:"omit"});
  if(!r.ok)throw new Error("Sprachdaten fehlen");
  mod.FS.writeFile("deu.traineddata",new Uint8Array(await r.arrayBuffer()));
  api=new mod.TessBaseAPI();
  if(api.Init(null,"deu")!==0)throw new Error("Texterkennung konnte nicht starten");
  api.SetVariable("preserve_interword_spaces","1");
  api.SetVariable("user_defined_dpi","300");
}
onmessage=async e=>{
  const {id,simd,images}=e.data;
  try{
    await init(simd);
    const texts=[];
    for(const img of images){
      mod.FS.writeFile("/input",new Uint8Array(img));
      api.SetPageSegMode(6);
      api.SetImageFile();
      texts.push(api.GetUTF8Text());
      try{mod.FS.unlink("/input")}catch(x){}
    }
    postMessage({id,ok:true,texts});
  }catch(err){postMessage({id,ok:false,error:String(err&&err.message||err)})}
};
