$(document).ready(function(){

    // 공통: 모달 열기 함수
    function openModal($modal) {
      // 스크롤 항상 맨 위에서 시작
      $modal.scrollTop(0);

      $modal.fadeIn(200);
      $('body').css('overflow', 'hidden'); // 백그라운드 스크롤 잠금
    }

    // 공통: 모달 닫기 함수
    function closeModal($modal) {
      // 닫을 때 스크롤을 맨 위로 올려 다음 오픈도 top에서 시작
      // (fadeOut 콜백에서도 한 번 더 보정)
      $modal.scrollTop(0);

      $modal.fadeOut(200, function () {
        $modal.scrollTop(0);
      });
      $('body').css('overflow', 'auto'); // 백그라운드 스크롤 복구
    }

    // === 열기 버튼 ===
    $('#openModal1').on('click', function () {
      openModal($('#modal1'));
    });

    $('#openModal2').on('click', function () {
      openModal($('#modal2'));
    });

    $('#openModal3').on('click', function () {
      openModal($('#modal3'));
    });

    // === 닫기 버튼 ===
    $('.close').on('click', function () {
      const $modal = $(this).closest('.modal');
      closeModal($modal);
    });

    // === 배경(오버레이) 클릭 시 닫기 ===
    // window 전체가 아니라 각 모달 자체에 이벤트를 걸어 정확도↑
    $('.modal').on('click', function (e) {
      if (e.target === this) { // 오버레이 영역 클릭일 때만
        closeModal($(this));
      }
    });

    // (선택) ESC 키로 닫기
    $(document).on('keydown', function (e) {
      if (e.key === 'Escape') {
        $('.modal:visible').each(function () {
          closeModal($(this));
        });
      }
    });
  

})