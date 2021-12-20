import { filterDemoProducts } from "./filterDemoProducts.js";

const mockAlfrescoInfo =
  "nombre;etapa;nivel;nodeRef;tieneUnidadDemo;esPromocional;recursosUnidadDemo;tieneUnidadUno;recursosUnidadUno;asignaturas;idSim\n" +
  "Prueba B2B 6000 Oup;03 EDUCACION SECUNDARIA;11 1º ESO;workspace://SpacesStore/cb9d8b50-194a-43eb-90b9-787172949697;1;0;0;1;7;Inglés;147300605\n" +
  "Elt Atx PRUEBA 20180206 XXXXXXXXX;03 EDUCACION SECUNDARIA;11 1º ESO;workspace://SpacesStore/872ac7ac-f942-4180-a290-f4b9ed04866e;1;0;4;1;43;Inglés;147298235\n" +
  "Readers ELT ESO3;03 EDUCACION SECUNDARIA;13 3º ESO;workspace://SpacesStore/42890a9b-2a80-4d1b-9462-d0daf768498a;0;0;0;0;0;Inglés;147300915\n" +
  "Readers ELT;03 EDUCACION SECUNDARIA;11 1º ESO;workspace://SpacesStore/48ef2645-7913-401e-a76c-c9f19bc0b83d;0;0;0;1;1;Inglés;147300777\n" +
  "Lij LENG;01 EDUCACIÓN INFANTIL;01 EDUCACION INFANTIL 2 AÑOS;workspace://SpacesStore/d44b592c-9b67-489b-9550-d8ca01d26209;0;0;0;0;0;Lengua y Literatura Castellana;147300781";

describe("filterDemoProducts - Basis unit tests", () => {
  it("should return only the lines for demo products for single environment requests", () => {
    const actual = filterDemoProducts(alfrescoInfo);
  });
});
