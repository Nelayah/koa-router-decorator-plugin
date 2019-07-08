import {Controller, RequestMapping} from '../lib';

@Controller
export default class {
  @RequestMapping({method: 'GET', url: '/example01'})
  async example01(ctx, _) {
    ctx.body = 'example01';
  }
}