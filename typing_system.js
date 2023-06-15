// 入力データのインポート
import data from "./inport_data.json" assert {type: "json"};


// 繰り返し回数の設定
const repeat_num = 5;


// 画面に表示する要素の定義・表示
const word = document.createElement("h1");
const string = document.createElement("h1");
const result = document.createElement("h1");

word.textContent = "press Enter key";
word.id = "word";
string.textContent = `繰り返し回数：${repeat_num}回`;
string.id = "string";
result.textContent = "";
result.id = "result";

document.body.appendChild(word);
document.body.appendChild(string);
document.body.appendChild(result);


// 各種宣言
let result_obj = {result:{}};
let no = Math.floor(Math.random() * data.length);
let result_str = "";
let input_str = "";
let i = -1;
let num = 0;
let isEnd = false;
let isStart = false;
let startTime;
let endTime;


window.addEventListener("keydown", (event) => {
	// 押下されたキーの取得
	let keyCode = event.key;

	// Enterキーで発火
	if (keyCode === 'Enter') {
		isStart = true;
	}

	if (!isEnd && isStart) {
		// 計測開始(初回の例外処理)
		if (num === 0 && i === -1) {
			startTime = performance.now();
			i = 0;
		}


		// ユーザ入力値の記録
		if (!(keyCode.match(/[^0-9a-z\-]/))) {
			input_str += keyCode;
		}


		// 単語と文字列の表示
		word.textContent = `単語：${data[no].view_str}`;
		string.textContent = `文字列：${data[no].cmp_str}`;


		// 文字一致判定
		if (data[no].cmp_str.charAt(i) === keyCode) {
		result_str += keyCode;
		i++;
		}


		// 正解しているところまで表示
		result.textContent = `結果：${result_str}`;

		
		// 文字列一致判定
		if (i  === data[no].cmp_str.length) {
			// 計測終了
			endTime = performance.now();


			// 出力データ整形
			let Obj = {};
			Obj["word"] = `${data[no].view_str}`;
			Obj["cmp_str"] = data[no].cmp_str;
			Obj["input_str"] = input_str;
			Obj["cmp_str.length"] = data[no].cmp_str.length;
			Obj["input_str.length"] = input_str.length;
			Obj["correct_rate"] = data[no].cmp_str.length / input_str.length;
			Obj["time"] = endTime - startTime;
			result_obj.result[`${num}`] = Obj;


			// 初期化
			result_str = "";
			input_str = "";
			i = 0;
			num++;

			no = Math.floor(Math.random() * data.length);
			word.textContent = `単語：${data[no].view_str}`;
			string.textContent = `文字列：${data[no].cmp_str}`;
			result.textContent = `結果：${result_str}`;


			// 計測開始
			startTime = performance.now();
		}

		// 終了判定
		if (num === repeat_num) {
			isEnd = true;

			// データ出力
			word.textContent = "終了しました。2秒後に結果をダウンロードします。";
			string.textContent = "";
			result.textContent = "";

			const fileName = "result.json";
			const data = JSON.stringify(result_obj, null, '  ');

			const btn_download = document.createElement("a");
			btn_download.id = "btn_download";

			btn_download.href = "data:text/plain," + encodeURIComponent(data);
			btn_download.download = fileName;


			// ダウンロード・再開
			setTimeout(function(){
				btn_download.click();
				word.textContent = "3秒後に再開します。";
				setTimeout(function(){
					num = 0;
					i = -1;
					isEnd = false;
					isStart = false;
					word.textContent = "press Enter key";
					string.textContent = `繰り返し回数：${repeat_num}回`;
					result.textContent = "";
					window.addEventListener("keydown", function(){}, {once: true});
				}, 3000);
			}, 2000);
		}
	} else {}
})