
import createApp from './app';
import { env } from './config';

const app = createApp();
const PORT = Number(env.port) || 4001;

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
