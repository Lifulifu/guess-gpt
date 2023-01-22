# GuessGPT
沒朋友也能玩的猜物品遊戲！

## 玩法
- 用 **是非題** 詢問chatGPT來猜出某樣東西。
<img width=400 src="https://i.imgur.com/8mz6H6t.png"/>

- `🤔`代表你要問出的`這個東西`，問題中必須包含它。它可以出現在問題的任何地方。按`這個東西🤔`按鈕可以加入編輯中的文字。
<img width=400 src="https://i.imgur.com/74aoIrq.png"/>

<img width=200 src="https://i.imgur.com/c8PJnF9.png"/>

- 若問題不是是非題，將無法得到線索
<img width=400 src="https://i.imgur.com/PJThQWz.png"/>

<img width=400 src="https://i.imgur.com/TBR3qfa.png"/>

- 若答對或放棄即可以揭曉答案，在對話紀錄chatGPT會試著解釋他每一題的回答，看看到底是誰在雷。
<img width=400 src="https://i.imgur.com/HQqUEA9.png"/>

- 若出現錯誤，有可能是由於超出chatGPT流量限制，也有可能是你的問題太奇怪，chatGPT給出的答案無法解析
<img width=400 src="https://i.imgur.com/YcA3BDv.png"/>
  
- 儘量問具體明確的問題，否則容易得到"不一定"的答案
<img width=400 src="https://i.imgur.com/pg1C4am.png"/>

## Dev
```
pnpm i
pnpm dev
```

## Build
```
pnpm build
```
