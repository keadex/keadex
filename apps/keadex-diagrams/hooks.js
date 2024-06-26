/**
  * This file contains the hooks triggered by Mina.
  * You can utilize these hooks to execute your custom code, provided with a structured representation of your diagrams.
  *
  * For proper execution, ensure the following:
  *  - Node.js is installed
  *  - Only CommonJS syntax is used
  *  - Existing function names are not altered or deleted
  *
  * Note: Additional hooks may be added in the future.
  * If you require a new hook, you can submit a new feature request at https://github.com/keadex/keadex/issues/new/choose
  *
  * GitHub Repo: https://github.com/keadex/keadex/tree/main/apps/keadex-mina
  * Website: https://keadex.dev/en/projects/keadex-mina
  */
 
 /**
  * @typedef {Object} Diagram - See {@link https://github.com/keadex/keadex/blob/main/libs/c4-model-ui-kit/src/models/autogenerated/Diagram.ts Diagram}.
  */
 
 /**
  * This hook is triggered when you create a diagram in {@link https://keadex.dev/en/projects/keadex-mina Mina}.
  *
  * @param {Diagram} diagram The created diagram
  */
 async function onDiagramCreated(diagram) {
   // your custom code
 }
 
 /**
  * This hook is triggered when you delete a diagram in {@link https://keadex.dev/en/projects/keadex-mina Mina}.
  *
  * @param {Diagram} diagram The deleted diagram
  */
 async function onDiagramDeleted(diagram) {
   // your custom code
 }
 
 /**
  * This hook is triggered when you save a diagram in {@link https://keadex.dev/en/projects/keadex-mina Mina}.
  *
  * @param {Diagram} diagram The saved diagram
  */
 async function onDiagramSaved(diagram) {
   // your custom code
 }
 
 module.exports = {
   onDiagramCreated,
   onDiagramDeleted,
   onDiagramSaved,
 };
 