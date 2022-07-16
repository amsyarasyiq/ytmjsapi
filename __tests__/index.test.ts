import YoutubeMusicApi from '../src/index';

// doesn't work anyway lol
describe('Testing main', () => {
  test('empty string should result in zero', async () => {
    let api = await YoutubeMusicApi.create();
    let results: any = await api.search("ピポパポPeople!");
    
    expect(results).toHaveProperty("content");
  });
});