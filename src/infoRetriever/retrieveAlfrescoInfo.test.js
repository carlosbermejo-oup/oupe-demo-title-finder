import { retrieveAlfrescoInfo } from "./retrieveAlfrescoInfo.js";
import * as verifyConnection from "./verifyConnection.js";
import axios from "axios";

jest.mock("axios");
jest.mock("./verifyConnection");

const environmentSettings = {
  settings: {
    urls: {
      alfresco_url: "http://82.223.131.223:8080",
      premium_url: "https://api.oxfordpremium.dev.oupe.es",
    },
  },
};

const allEnvironmentSettings = {
  settings: {
    development: {
      urls: {
        alfresco_url: "http://82.223.131.223:8080",
        premium_url: "https://api.oxfordpremium.dev.oupe.es",
      },
    },
    preproduction: {
      urls: {
        alfresco_url: "http://82.223.252.223:8080",
        premium_url: "https://api.oxfordpremium.prepro2.oupe.es",
      },
    },
    production: {
      urls: {
        alfresco_url: "http://82.223.51.220:6081",
        premium_url: "https://api.oxfordpremium.oupe.es",
      },
    },
  },
};

describe("retrieveAlfrescoInfo - basic tests", () => {
  beforeAll(() => {
    global.alfresco_username = "user";
    global.alfresco_password = "test";
  });

  afterAll(() => {
    jest.unmock("axios");
    jest.unmock("./verifyConnection");
    jest.resetAllMocks();
  });

  it("should retrieve all titles for the current Alfresco environment.", async () => {
    verifyConnection.isAlfrescoUp.mockResolvedValue(true);
    verifyConnection.verifyAlfrescoConnectivity.mockResolvedValue(true);
    axios.get.mockResolvedValue({
      status: 200,
      data: "Etapa;Nivel;Titulo;NodeRef",
    });

    const actual = await retrieveAlfrescoInfo(environmentSettings);

    expect(actual).toEqual("Etapa;Nivel;Titulo;NodeRef");
    expect(axios.get).toHaveBeenCalledWith(
      "http://82.223.131.223:8080/alfresco/service/oupe/obtenerDatosRecursosDemoPorTitulo",
      {
        auth: { username: "user", password: "test" },
      }
    );
  });

  it("should return false if the call to Alfresco returns an unexpected response.", async () => {
    verifyConnection.isAlfrescoUp.mockResolvedValue(true);
    verifyConnection.verifyAlfrescoConnectivity.mockResolvedValue(true);
    axios.get.mockResolvedValue({
      status: 401,
      data: "Etapa;Nivel;Titulo;NodeRef",
    });

    const actual = await retrieveAlfrescoInfo(environmentSettings);

    expect(actual).toEqual(false);
    expect(axios.get).toHaveBeenCalledWith(
      "http://82.223.131.223:8080/alfresco/service/oupe/obtenerDatosRecursosDemoPorTitulo",
      {
        auth: { username: "user", password: "test" },
      }
    );
  });

  it("should throw an error if the call to retrieve information fails", async () => {
    verifyConnection.isAlfrescoUp.mockResolvedValue(true);
    verifyConnection.verifyAlfrescoConnectivity.mockResolvedValue(true);
    axios.get.mockImplementation(() => {
      throw new Error("Test failure");
    });
    await expect(retrieveAlfrescoInfo(environmentSettings)).rejects.toThrow(
      Error
    );
    await expect(retrieveAlfrescoInfo(environmentSettings)).rejects.toThrow(
      "Test failure"
    );
  });

  it("should throw an error if preliminary checks on Alfresco failed", async () => {
    verifyConnection.isAlfrescoUp.mockResolvedValue(false);
    verifyConnection.verifyAlfrescoConnectivity.mockResolvedValue(false);
    axios.get.mockResolvedValue({
      status: 200,
      data: "Etapa;Nivel;Titulo;NodeRef",
    });
    await expect(retrieveAlfrescoInfo(environmentSettings)).rejects.toThrow(
      Error
    );
    await expect(retrieveAlfrescoInfo(environmentSettings)).rejects.toThrow(
      "Connection to Alfresco could not be verified."
    );
  });

  it("should retrieve all titles for the all Alfresco environment.", async () => {
    process.env.NODE_CONFIG_ENV = "all";

    verifyConnection.isAlfrescoUp.mockResolvedValue(true);
    verifyConnection.verifyAlfrescoConnectivity.mockResolvedValue(true);
    axios.get.mockResolvedValue({
      status: 200,
      data: "Etapa;Nivel;Titulo;NodeRef",
    });

    const actual = await retrieveAlfrescoInfo(allEnvironmentSettings);

    expect(actual).toEqual({
      development: "Etapa;Nivel;Titulo;NodeRef",
      preproduction: "Etapa;Nivel;Titulo;NodeRef",
      production: "Etapa;Nivel;Titulo;NodeRef",
    });
    expect(axios.get).toHaveBeenCalledTimes(3);
  });

  it("should return an error message if a request to any of the environments fails.", async () => {
    process.env.NODE_CONFIG_ENV = "all";

    verifyConnection.isAlfrescoUp.mockResolvedValue(true);
    verifyConnection.verifyAlfrescoConnectivity.mockResolvedValue(true);
    axios.get.mockResolvedValueOnce({
      status: 401,
    });
    axios.get.mockResolvedValueOnce({
      status: 200,
      data: "Etapa;Nivel;Titulo;NodeRef",
    });
    axios.get.mockResolvedValueOnce({
      status: 401,
    });

    const actual = await retrieveAlfrescoInfo(allEnvironmentSettings);

    expect(actual).toEqual({
      development: "Could not retrieve",
      preproduction: "Etapa;Nivel;Titulo;NodeRef",
      production: "Could not retrieve",
    });
    expect(axios.get).toHaveBeenCalledTimes(3);
  });
});
