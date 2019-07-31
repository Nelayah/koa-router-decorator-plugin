import * as Koa from 'koa';
import * as KoaRouter from 'koa-router';
import * as path from 'path';
import * as http from 'http';
import KoaDecoratorRouter, { loadDecoratorRouter } from '../lib';

const app = new Koa();
const router = new KoaRouter();
const request = url => {
  return new Promise(resolve => {
    http.get(`http://localhost:4000${url}`, response => {
      let data = '';
      response.on('data', _data => (data += _data));
      response.on('end', () => resolve(data));
    });
  });
}

loadDecoratorRouter({ dir: path.join(__dirname, '../example'), extension: '.ts' });
router.get('/heartbeats', async (ctx, _) => {
  ctx.body = 'success';
});

app
  .use(router.routes())
  .use(router.allowedMethods());

app
  .use(KoaDecoratorRouter.routes())
  .use(KoaDecoratorRouter.allowedMethods());

let server;;

beforeAll(async done => {
  server = app.listen(4000);
  done();
});

afterAll(async done => {
  await server.close();
  done();
});

describe('react router decorator', () => {
  it('不影响既存在的路由', async () => {
    const data = await request('/heartbeats');
    expect(data).toBe('success');
  });
  it('@Controller 无参数', async () => {
    const data = await request('/example01');
    expect(data).toBe('example01');
  });
  it('@Controller 有参数', async () => {
    const data = await request('/prefix/example02');
    expect(data).toBe('example02');
  });

  it('@RequestMapping url参数为数组', async () => {
    const data01 = await request('/prefix/example03');
    const data02 = await request('/prefix/example04');
    expect(data01).toBe('example03');
    expect(data02).toBe('example03');
  });
});

