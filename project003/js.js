$(document).ready(function () {
  /* =============================
     공통 셀렉터
     ============================= */
  const $sections = $('section');
  const $navItems = $('.gnb li');
  const $wax = $('.sealingWax');

  /* =============================
     별 생성 유틸 (보일 때 1회만 생성)
     jQuery 버전
     ============================= */
  function ensureStars($section) {
    const $container = $section.find('.stars-container');
    if (!$container.length) return;
    if ($container.data('starsReady') === 1) return;
    $container.data('starsReady', 1);

    const starCount = 500;
    const vw = $(window).width();
    const vh = $(window).height();

    let html = '';
    for (let i = 0; i < starCount; i++) {
      const size = Math.random() * 3 + 1;
      const x = Math.random() * vw;
      const y = Math.random() * vh;
      const dur = (Math.random() * 3 + 2).toFixed(2) + 's';
      html += `<div class="PLstar" style="
        width:${size}px;height:${size}px;
        left:${x}px;top:${y}px;
        animation:twinkle ${dur} infinite;
      "></div>`;
    }
    $container.append(html);
  }

  /* =============================
     갤러리 스크롤 핸들러 ON/OFF
     ============================= */
  function enableGalleryScroll() {
    $(window)
      .off('scroll.gallery')
      .on('scroll.gallery', function () {
        const sc = $(this).scrollTop();

        // 자동 스크롤 중에는 즉시 반영(튀지 않게)
        if ($('html, body').is(':animated')) {
          $('.galleryWrap').css({ left: -sc });
        } else {
          $('.galleryWrap').stop(true).animate({ left: -sc }, 300);
        }
      });
  }
  function disableGalleryScroll() {
    $(window).off('scroll.gallery');
  }

  /* =============================
     섹션 전환 함수
     ============================= */
  function showSection(hash) {
    const target = (hash && $(hash).length) ? hash : '#landing';

    // 섹션 표시 전환
    $sections.hide();
    $(target).show();

    // NAV 표시/숨김 + 랜딩 복귀 시 왁스 초기화
    if (target === '#landing') {
      $('.gnb').hide();
      $wax.removeClass('breaking clicked'); // 상태 리셋
    } else {
      $('.gnb').show();
    }

    // 메뉴 on 상태 업데이트
    $navItems.removeClass('on');
    $navItems.find(`a[href="${target}"]`).parent().addClass('on');

    // 보이는 섹션의 별을 최초 1회 생성
    ensureStars($(target));

    // ----- 갤러리 전용 동작 (여기만 남기고, 다른 중복 블록은 삭제됨) -----
    if (target === '#gallery') {
      enableGalleryScroll();

      // 1) 먼저 0으로 리셋 (들어오자마자 꼭 맨 위에서 시작)
      $('html, body').stop(true).scrollTop(0);
      $('.galleryWrap').css({ left: 0 }); // 시각 즉시 반영

      // 2) 자동 인트로 스크롤: 0 → 2000
      $('html, body').animate(
        { scrollTop: 4000 },
        {
          duration: 1600,   // 1200~2000 사이에서 취향대로
          easing: 'swing',
          step() {
            // 진행 중에도 가로 이동을 즉시 반영(부드럽게 보이게)
            const sc = $(window).scrollTop();
            $('.galleryWrap').css({ left: -sc });
          }
        }
      );
    } else {
      // 다른 섹션으로 나가면 자동 스크롤 중단 + 리셋
      $('html, body').stop(true);
      disableGalleryScroll();
      $('html, body').scrollTop(0);
      $('.galleryWrap').css({ left: 0 });
    }

    // 해시 유지(뒤로가기 위해)
    window.history.replaceState(null, '', target);
  }

  /* =============================
     NAV 클릭: 해시 내비게이션
     ============================= */
  $('.gnb').on('click', 'a', function (e) {
    const href = $(this).attr('href');
    if (href && href.indexOf('#') === 0) {
      e.preventDefault();
      showSection(href);
    }
  });

  /* =============================
     초기 진입 + 해시 변경 대응
     ============================= */
  showSection(window.location.hash);
  $(window).on('hashchange', function () {
    showSection(window.location.hash);
  });

  /* =============================
     실링왁스: 깨짐 애니메이션 끝난 뒤 프로필로 이동
     ============================= */
  if ($wax.length) {
    $wax.on('click', function () {
      const $self = $(this);
      if ($self.hasClass('breaking')) return; // 중복 클릭 방지
      $self.addClass('breaking');

      const $intact = $self.find('.seal-intact');
      let moved = false;

      function goProfile() {
        if (moved) return;
        moved = true;
        window.location.hash = '#profile'; // showSection 자동 실행
      }

      if ($intact.length) {
        $intact.one('animationend', goProfile);
        setTimeout(goProfile, 800);
      } else {
        setTimeout(goProfile, 800);
      }
    });
  }

  /* =============================
     갤러리 카드 인터랙션
     ============================= */
  $('.galleryWrap').on('click', 'article h2', function (e) {
    e.preventDefault();
    const $h2 = $(this);
    const src = $h2.find('a').attr('href') || '';

    $('.galleryWrap article').removeClass('on');
    $h2.parent('article').addClass('on');

    $('.galleryWrap article p img').attr('src', '');
    $h2.siblings('p').find('img').attr('src', src);
  });

  $('.galleryWrap').on('click', 'article span', function () {
    $('.galleryWrap article').removeClass('on');
  });

  /* =============================
     뮤직비디오 플레이어 (그대로 사용)
     ============================= */
  const $video = $('.videoBox video')[0];
  const $audio = $('#audio')[0];
  const $playBtn = $('#play');
  const $prevBtn = $('#prev');
  const $nextBtn = $('#next');
  const $progress = $('#progress');
  const $progressContainer = $('#seek');
  const $currentTime = $('#current');
  const $duration = $('#duration');
  const $likeBtn = $('.playMusicLight .Title span img');

  let isPlaying = false;
  let liked = false;
  let rafId = null;

  function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  function updateProgress() {
    if ($audio.duration) {
      const percent = ($audio.currentTime / $audio.duration) * 100;
      $progress.css('width', percent + '%');
      $currentTime.text(formatTime($audio.currentTime));
      if (Math.abs($video.currentTime - $audio.currentTime) > 0.5) {
        $video.currentTime = $audio.currentTime;
      }
    }
  }

  function startProgressLoop() {
    cancelAnimationFrame(rafId);
    const tick = () => {
      updateProgress();
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
  }
  function stopProgressLoop() {
    cancelAnimationFrame(rafId);
    rafId = null;
  }

  $playBtn.on('click', function () {
    if (isPlaying) {
      $audio.pause();
      $video.pause();
    } else {
      if (isNaN($audio.duration)) {
        $audio.addEventListener('loadedmetadata', () => {
          $duration.text(formatTime($audio.duration));
        }, { once: true });
      }
      $audio.play();
      $video.play();
    }
  });

  $($audio).on('loadedmetadata', function () {
    $duration.text(formatTime($audio.duration));
    updateProgress();
  });

  $($audio).on('play', function () {
    isPlaying = true;
    updateProgress();
    startProgressLoop();
    if ($video.paused) $video.play();
  });

  $($audio).on('pause ended', function () {
    isPlaying = false;
    stopProgressLoop();
  });

  $($audio).on('timeupdate', function () {
    updateProgress();
  });

  $progressContainer.on('click', function (e) {
    const width = $(this).width();
    const clickX = e.offsetX;
    const duration = $audio.duration || 0;
    const newTime = (clickX / width) * duration;

    $audio.currentTime = newTime;
    $video.currentTime = newTime;

    if (!isPlaying) {
      $audio.play();
      $video.play();
    }
    updateProgress();
  });
});
