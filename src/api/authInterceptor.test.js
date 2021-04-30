import { authInterceptor } from "./authInterceptor";
import axiosConfig from "./AxiosConfig";

describe("authInterceptor", () => {
  it("aPI request should add authorization token to header", () => {
    authInterceptor("");
    const result = axiosConfig.interceptors.request.handlers[0].fulfilled({
      headers: {},
    });
    expect(result.headers).toHaveProperty("Authorization");
  });
});
