import React from "react";
import useAxiosLoader from "./axios-loader";
import { render, waitFor } from "@testing-library/react";
import MockAdapter from "axios-mock-adapter";
import axiosConfig from "../api/AxiosConfig";

const TestComponent = () => {
  const showLoader = useAxiosLoader();
  return <div>{showLoader ? <>Loading...</> : <>Not Loading</>}</div>;
};

describe("useAxiosLoader", () => {
  const mockAxios = new MockAdapter(axiosConfig, {
    delayResponse: 200,
  });

  it("should not show loader", () => {
    const { getByText } = render(<TestComponent />);
    expect(getByText("Not Loading")).toBeInTheDocument();
  });

  it("should show loader while request processing and hide after request complete", async () => {
    const { getByText } = render(<TestComponent />);
    mockAxios.onGet("http://localhost").reply(200);
    const response = axiosConfig.get("http://localhost").then(async () => {
      expect(getByText("Not Loading")).toBeInTheDocument();
    });
    await waitFor(() => expect(getByText("Loading...")).toBeInTheDocument());
    // eslint-disable-next-line
    return response;
  });

  it("should show loader while request processing and hide after request failed", async () => {
    const { getByText } = render(<TestComponent />);
    mockAxios.onGet("http://localhost").networkError();
    const response = axiosConfig.get("http://localhost").catch(async () => {
      expect(getByText("Not Loading")).toBeInTheDocument();
    });
    await waitFor(() => expect(getByText("Loading...")).toBeInTheDocument());
    // eslint-disable-next-line
    return response;
  });

  it("should not show loader, if axios request config contains supressLoader property with value true", async () => {
    const { getByText } = render(<TestComponent />);
    mockAxios.onGet("http://localhost").reply(200);
    const response = axiosConfig
      .get("http://localhost", {
        supressLoader: true,
      })
      .then(async () => {
        expect(getByText("Not Loading")).toBeInTheDocument();
      });
    expect(getByText("Not Loading")).toBeInTheDocument();
    // eslint-disable-next-line
    return response;
  });
});
