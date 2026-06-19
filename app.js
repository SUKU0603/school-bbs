// 【重要】SupabaseのURLとキー
const SUPABASE_URL = 'https://gmwjrxoxxlxhrfygrejb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_I5S43C0y3Fdv1j-irV2x7w_x5cJYAO9';

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// メッセージを読み込む関数
async function loadMessages() {
    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('id', { ascending: true });

    if (error) return console.error(error);

    const container = document.getElementById('messages');
    container.innerHTML = '';
    data.forEach(msg => {
        const div = document.createElement('div');
        div.className = 'msg'; // ⭕ 直したよ！
        div.innerHTML = `<strong>${escapeHtml(msg.username)}</strong>: ${escapeHtml(msg.content)}`;
        container.appendChild(div);
    });
    container.scrollTop = container.scrollHeight;
}

// 送信ボタンを押したときに動く関数
async function sendMessage() {
    const username = document.getElementById('username').value || '名無しさん';
    const content = document.getElementById('content').value;

    if (!content) return alert('メッセージを入力してね！');

    const { error } = await supabase
        .from('posts')
        .insert([{ username, content }]); // ⭕ contentを1つに直したよ！

    if (error) {
        alert('送信に失敗しちゃいました...');
        console.error(error);
    } else {
        document.getElementById('content').value = ''; 
        loadMessages(); 
    }
}

// 安全対策の関数
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// 最初に実行
loadMessages();
// 3秒ごとに自動チェック
setInterval(loadMessages, 3000);