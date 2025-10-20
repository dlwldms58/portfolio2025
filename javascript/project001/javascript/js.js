$(document).ready(function () {
  //--------------------------------------------------------------공지사항 설정하기
  const $wrap = $('.notice-wrap');
  let $items = $wrap.find('.notice');
  const DURATION = 2600;     // 공지 노출 시간(다음으로 넘어가기 전 대기)
  const SLIDE_MS = 650;      // CSS transition과 동일/약간 크게

  // 공지가 1개 이하면 동작 필요 없음
  if ($items.length <= 1) return;

  // 초기 상태 보정: 첫 번째만 .on, 나머지는 클래스 제거
  $items.removeClass('on out').eq(0).addClass('on');

  let timer = setInterval(nextNotice, DURATION);

  // 호버 시 일시정지 / 해제
  $wrap
    .on('mouseenter', function () { clearInterval(timer); })
    .on('mouseleave', function () { timer = setInterval(nextNotice, DURATION); });

  function nextNotice() {
    // 현재 보이는 것(.on)과 다음 것
    const $current = $wrap.find('.notice.on').first();
    const $next = $current.next('.notice').length ? $current.next('.notice') : $wrap.find('.notice').first();

    // 현재 것은 위로 사라지고(out), 다음 것은 올라오게(on)
    $current.removeClass('on').addClass('out');
    $next.addClass('on');

    // 애니메이션 끝난 뒤 현재 것을 맨 아래로 보내고 상태 초기화
    setTimeout(function () {
      $current.removeClass('out').appendTo($wrap);
      // DOM 순서가 바뀌었으니 캐시 갱신
      $items = $wrap.find('.notice');
    }, SLIDE_MS);
  }

// ---------------------------------------------------------- 요금 및 시간 팝업창 띄우기
// const modal = document.querySelector('.modal');
// const openBtn = document.getElementById('plus01');
// const closeBtn = document.querySelector('.close');

// openBtn.addEventListener('click', () => {
//   modal.style.display = 'flex';
// });

// closeBtn.addEventListener('click', () => {
//   modal.style.display = 'none';
// });

// modal.addEventListener('click', (e) => {
//   if(e.target === modal) modal.style.display = 'none';
// });

// ---------------------------------------------------------
// 팝업 요소
const modal1 = document.getElementById('modal1');
const modal2 = document.getElementById('modal2');

// 버튼 요소
const open1 = document.getElementById('openModal1');
const open2 = document.getElementById('openModal2');

// 닫기 버튼 (공통 클래스)
const closeBtns = document.querySelectorAll('.close');

// 열기
open1.addEventListener('click', () => modal1.style.display = 'flex');
open2.addEventListener('click', () => modal2.style.display = 'flex');

// 닫기 (X 버튼)
closeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    btn.closest('.modal').style.display = 'none';
  });
});

// 팝업 바깥 클릭 시 닫기
window.addEventListener('click', (e) => {
  if (e.target === modal1) modal1.style.display = 'none';
  if (e.target === modal2) modal2.style.display = 'none';
});





  //-------------------------------------------------------------히어로 사진 설정하기
  let current = 0;
  const img = $('.imgWrap img');
  const total = img.length;

  img.eq(current).addClass('active'); // 첫 번째 이미지 보여주기

  $('.btnR').click(function () {
    img.eq(current).removeClass('active');
    current++;
    if (current >= total) current = 0;
    img.eq(current).addClass('active');
  });

  $('.btnL').click(function () {
    img.eq(current).removeClass('active');
    current--;
    if (current < 0) current = total - 1;
    img.eq(current).addClass('active');
  });

  //-------------------------------------------------------------리뷰트랙 만들기
  // 리뷰 무한 롤링
  (function setupReviewMarquee() {
    const $viewport = $('.box4-2');
    if (!$viewport.length) return;
    const hasReviews = $viewport.children('.review').length > 0;
    if (!hasReviews) return;

    // 1) 현재 리뷰들을 트랙으로 감싸기
    if (!$viewport.children('.review-track').length) {
      $viewport.wrapInner('<div class="review-track"></div>');
    }
    const $track = $viewport.children('.review-track');

    // 2) 원본 세트를 복제해서 뒤에 붙여 끊김 없게
    //    (이미 복제해놨으면 중복 복제를 막기 위해 한 번만)
    if ($track.children('.review').length <= 8) {
      $track.append($track.children().clone(true));
    }

    // 3) 컨텐츠 폭에 따라 속도(지속시간) 자동 계산
    function applyDuration() {
      // 원본 1세트의 총 너비(복제 전 폭) = 현재의 절반
      const totalWidth = $track[0].scrollWidth / 2; // px
      const speed = 60; // px/s : 숫자 키우면 더 빠르게
      const duration = totalWidth / speed; // s
      $track.css('animation-duration', duration + 's');
    }

    applyDuration();
    // 반응형 대응: 리사이즈 시 지속시간 재계산(디바운스)
    let resizeTimer = null;
    $(window).on('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(applyDuration, 150);
    });
  })();





  //----------------------생물 백과사전 탭바 설정하기
  const $tabs = $('.box5-2 .tab li');
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

});
