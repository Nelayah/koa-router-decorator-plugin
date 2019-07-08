import {Controller, RequestMapping} from '../lib';

@Controller({prefix: '/prefix'})
export default class {
  @RequestMapping({method: 'GET', url: '/example02'})
  async example01(ctx, _) {
    ctx.body = 'example02';
  }
}