$(document).ready(function () {

  const $notices = $('.notice-wrap .notice');
  const count = $notices.length;
  let index = 0;

  // 초기 상태 정리: 첫 번째만 on, 나머지는 아래(translateY(100%))
  $notices.removeClass('on out')
          .css({ transform: 'translateY(100%)', opacity: 0 });
  $notices.eq(0).addClass('on')
          .css({ transform: 'translateY(0)', opacity: 1 });

  // 자동 전환 (주기 조절 가능)
  const INTERVAL = 2000; // 2초마다 전환
  let timer = setInterval(nextNotice, INTERVAL);

  function nextNotice() {
    const $current = $notices.eq(index);
    const nextIdx = (index + 1) % count;
    const $next = $notices.eq(nextIdx);

    // 현재 것은 위로(out), 다음 것은 아래에서(on)
    $current.removeClass('on').addClass('out');
    $next.removeClass('out').addClass('on');

    index = nextIdx;
  }

  // (선택) 호버 시 일시정지/재개
  $('.notice-wrap').on('mouseenter', function () {
    clearInterval(timer);
  }).on('mouseleave', function () {
    timer = setInterval(nextNotice, INTERVAL);
  });


  //-------------------리뷰트랙 만들기
  // 리뷰 무한 롤링
(function setupReviewMarquee(){
  const $viewport = $('.box4-2');
  if (!$viewport.length) return;
  const hasReviews = $viewport.children('.review').length > 0;
  if (!hasReviews) return;

  // 1) 현재 리뷰들을 트랙으로 감싸기
  if (!$viewport.children('.review-track').length){
    $viewport.wrapInner('<div class="review-track"></div>');
  }
  const $track = $viewport.children('.review-track');

  // 2) 원본 세트를 복제해서 뒤에 붙여 끊김 없게
  //    (이미 복제해놨으면 중복 복제를 막기 위해 한 번만)
  if ($track.children('.review').length <= 8) {
    $track.append($track.children().clone(true));
  }

  // 3) 컨텐츠 폭에 따라 속도(지속시간) 자동 계산
  function applyDuration(){
    // 원본 1세트의 총 너비(복제 전 폭) = 현재의 절반
    const totalWidth = $track[0].scrollWidth / 2; // px
    const speed = 60; // px/s : 숫자 키우면 더 빠르게
    const duration = totalWidth / speed; // s
    $track.css('animation-duration', duration + 's');
  }

  applyDuration();
  // 반응형 대응: 리사이즈 시 지속시간 재계산(디바운스)
  let resizeTimer = null;
  $(window).on('resize', function(){
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(applyDuration, 150);
  });
})();





//----------------------생물 백과사전 탭바 설정하기
  const $tabs  = $('.box5-2 .tab li');
  const $lists = $('.box5-3 > ul'); // .oceanCreature, .shoreCreature

  // 접근성
  $('.box5-2 .tab').attr('role', 'tablist');
  $tabs.attr({ role: 'tab', tabindex: '0' });

  function show(kind) {
    // 탭 on
    $tabs.removeClass('on').attr('aria-selected', 'false');
    $tabs.filter('.' + kind).addClass('on').attr('aria-selected', 'true');

    // 리스트 전환 (flex 유지 + 페이드인)
    const $target = $('.' + kind + 'Creature');
    $lists.hide();                          // 둘 다 감추고
    $target.css('display', 'flex')          // 👉 flex로 보여야 하므로 미리 지정
           .hide().fadeIn(180);             // 페이드 인
    // 하단 버튼 문구
    const txt = (kind === 'ocean') ? '바닷 속 친구들 모두보기' : '숲 속 친구들 모두보기';
    $('.box5-4 a').text(txt);
  }

  // 초기 상태
  show('ocean');

  // 클릭/키보드 전환
  $tabs.on('click keydown', function (e) {
    if (e.type === 'click' || e.key === 'Enter' || e.key === ' ') {
      if (e.type === 'keydown') e.preventDefault(); // 스페이스 스크롤 방지
      const kind = $(this).hasClass('ocean') ? 'ocean' : 'shore';
      show(kind);
    }
  });

  // ===== 프로그램 시간 선택 =====
  // 1) 기본 선택 없으면 첫 번째(11:00) 선택
  $('.program_time ul').each(function () {
    const $ul = $(this);
    if ($ul.find('li.on').length === 0) {
      $ul.find('li').first().addClass('on');
    }
  });

  // 2) 클릭 시 같은 목록 내에서 한 개만 on
  $(document).on('click', '.program_time ul li', function () {
    const $li = $(this);
    $li.addClass('on').siblings().removeClass('on');

    // 선택된 시간 저장(필요시 활용)
    const time = $li.text().trim();
    const $programCard = $li.closest('[class^="program"]'); // program1, program2...
    $programCard.attr('data-selected-time', time);
  });

  // 3) 키보드 접근성 (Enter/Space)
  $('.program_time ul li').attr('tabindex', '0');
  $(document).on('keydown', '.program_time ul li', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      $(this).click();
    }
  });

}); // ← 여기서 끝! 밑에 여분의 "})" 넣지 말기
