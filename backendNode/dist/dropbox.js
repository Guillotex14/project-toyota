"use strict";
// // require("isomorphic-fetch");
// import fetch from "node-fetch";
// import { Dropbox } from "dropbox";
// export async function dropboxConnection(){
//     try {
//         const dbx = new Dropbox({
//         accessToken:"sl.BjVk8JpSmSLNUQGnYuv1FHPSw8EP2ZqHjUip_SkCG7JT1RDB6m5TmuqBrEgHEO8SsRjfkLeReNsCHeUncHzTptrJKtN0bU0PcKHrMruuliCP2guizANRrgCEmWWFLi8EXbMMuQnoANCH", fetch: fetch});
//         dbx.filesListFolder({path: ''}).then(function(response) {
//         // console.log(response);
//             if (response.status == 200) {
//                 if (response.result.entries.length == 0) {
//                     dbx.filesCreateFolderV2({path: '/vehiculos'}).then((response) => {
//                         console.log(response);
//                     }).catch((err) => {
//                         console.log(err);
//                     });
//                     //aqui creamos la carpeta pra guardar las imagenes de los usuarios
//                     dbx.filesCreateFolderV2({path: '/usuarios'}).then((response) => {
//                         console.log(response);
//                     }).catch((err) => {
//                         console.log(err);
//                     });
//                 }
//             }
//         }).catch(function(error) {
//             console.log(error);
//         });
//     } catch (error) {
//         console.error("error de conexion ", error)
//     }
// }
//# sourceMappingURL=dropbox.js.map