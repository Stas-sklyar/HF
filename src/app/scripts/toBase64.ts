const toBase64 = (file: any) => new Promise((resolve, reject) => {
   const reader = new FileReader();
   reader.readAsDataURL(file);
   reader.onload = () => resolve(reader.result);
   reader.onerror = error => reject(error);
});

export async function convertFileToBase64(file: any) {
   const result: any = await toBase64(file).catch(e => Error(e));
   if(result instanceof Error) {
      console.log('Error: ', result.message);
      return;
   }
   return result.replace(/^data:(.*,)?/, '')
}