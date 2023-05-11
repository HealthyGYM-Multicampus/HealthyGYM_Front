export const shareKakao = (url, title) => {

    if (window.Kakao) {
        const kakao = window.Kakao;
        if (!kakao.isInitialized()) {
          kakao.init(process.env.REACT_APP_KAKAO_JAVASCRIPT_KEY); // 카카오에서 제공받은 javascript key
        }
        
        kakao.Link.sendDefault({
          objectType: "feed",
          content: {
            title: title,
            imageUrl: "https://firebasestorage.googleapis.com/v0/b/healthygym-8f4ca.appspot.com/o/files%2F1683078742736.png?alt=media&token=dff93ed7-bcdc-4f44-9705-ac905d6a310d",
            link: {
              mobileWebUrl: url,
              webUrl: url
            }
          },
          buttons: [
            {
              title: "웹에서 보기",
              link: {
                mobileWebUrl: url,
                webUrl: url
              }
            }
          ]
        });
    }
}