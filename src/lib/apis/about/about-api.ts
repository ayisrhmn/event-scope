import { BaseApiResult } from "../api-types";
import { BaseApi } from "../base";
import { About } from "./about-type";

export class AboutApi extends BaseApi {
  getAbout() {
    return this.get<BaseApiResult<About[]>>({
      url: "/about",
    });
  }
}
