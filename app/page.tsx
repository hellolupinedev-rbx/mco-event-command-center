import {requireChatGPTUser} from './chatgpt-auth';
import CommandCenter from './command-center';
export const dynamic = 'force-dynamic';
export default async function Page(){const user=await requireChatGPTUser('/');return <CommandCenter user={{name:user.displayName,email:user.email}}/>;}
