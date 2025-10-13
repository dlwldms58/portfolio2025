$(document).ready(function () {


    // logo를 클릭했을때 메인페이지가 나타나기

    $(".logo").click(function () {
        $("#sub01").fadeOut();
        $("#wrap").fadeIn();
    });



    // 장바구니 나왔다 들어가기

    let click = 0;
    $(".icon").click(function () {
        click++;
        if (click == 2) click = 0;
        console.log(click);

        $(this).parent(".shopping").toggleClass("on");
    });


    $('#shopping_popUp').on('click', function () {
        $(this).closest('.shopping').removeClass('on');
    });




    // 인기매뉴 캐러셀

    let ti = 0;

    $('.container button').click(function () {

        ti++;
        console.log(ti)
        $('.container li').eq(ti - 1).clone().appendTo('.container ul');
        $('.container ul').css({ 'left': -535 * ti })
        $('.container li').removeClass('on')
        $('.container li').eq(ti + 1).addClass('on')

    })


    //    자동으로 버튼을 클릭한 효과를 내라. 

    let slide = setInterval(function () {
        $('.container button').trigger('click')

    }, 2000)



    // 마우스가 올라가면 멈추고 마우스가 떠나면 움직여라. 

    $('.container').mouseenter(function () {

        clearInterval(slide)
    })

    $('.container').mouseleave(function () {
        slide = setInterval(function () {
            $('.container button').trigger('click')

        }, 2000)

    });



    // 화면이 브랜드를 보고있을때, 패럴렉스스크롤링이 일어나라.

    $(window).scroll(function () {
        let sc = $(this).scrollTop();
        let winH = $(window).height();

        $(".HISTORY").each(function () {
            let elTop = $(this).offset().top;

            if (sc > elTop - winH + 200) {
                $(this).addClass("on");
            } else {
                $(this).removeClass("on");
            }
        });
    });


    // ============================
    // BOX5 타임라인 패럴랙스 스크롤 리빌
    // ============================
    // 모든 HISTORY 섹션을 선택
    let historySections = $('.box5_inner .HISTORY');

    // 1️⃣ 초기 상태: 좌우로 살짝 숨기기
    historySections.each(function (index) {
        let groupLeft = $(this).find('.content-group_1');
        let groupRight = $(this).find('.content-group_2');
        let isOddSection = index % 2 === 0; // 홀짝 판단 (짝수 index = 왼→오)

        // 기본 스타일 (투명 + 좌우 오프셋)
        groupLeft.css({ opacity: 0, position: 'relative' });
        groupRight.css({ opacity: 0, position: 'relative' });

        if (isOddSection) {
            // 홀수번째(시각적으로 왼쪽 이미지)
            groupLeft.css({ left: -160 });
            groupRight.css({ left: 160 });
        } else {
            // 짝수번째(시각적으로 오른쪽 이미지)
            groupLeft.css({ left: 160 });
            groupRight.css({ left: -160 });
        }
    });

    // 2️⃣ 스크롤 시 나타나기
    function showHistoryOnScroll() {
        let scrollY = $(window).scrollTop();
        let windowH = $(window).height();
        let triggerPoint = scrollY + windowH * 0.8; // 화면 하단 20% 지점

        historySections.each(function () {
            let currentSection = $(this);
            let sectionTop = currentSection.offset().top;

            // 이미 나타난 섹션은 스킵
            if (currentSection.data('visible')) return;

            // 뷰포트 안에 들어오면 등장
            if (triggerPoint > sectionTop) {
                currentSection.data('visible', true);

                let groupLeft = currentSection.find('.content-group_1');
                let groupRight = currentSection.find('.content-group_2');

                // 자연스러운 시간차 애니메이션
                groupLeft.stop(true).animate({ opacity: 1, left: 0 }, 700, 'swing');
                groupRight.stop(true).delay(150).animate({ opacity: 1, left: 0 }, 700, 'swing');
            }
        });
    }

    // 이벤트 등록
    $(window).on('scroll.historyReveal resize.historyReveal', showHistoryOnScroll);
    showHistoryOnScroll(); // 페이지 로드 시 초기 실행





    // 서브페이지연결하기

    $(".gnb li")
        .eq(0)
        .click(function (e) {
            e.preventDefault();
            $("#wrap, #login").fadeOut();
            $("#sub01").fadeIn();
            $(".shopping").removeClass("on");
        });




    // ---------------- 로그인 페이지 열기 ----------------
    $(".util li")
        .eq(1)
        .click(function (e) {
            e.preventDefault();
            $(".shopping").removeClass("on");
            $("#sub01").fadeOut();
            $("#login").fadeIn();
            $("body").addClass("no-scroll");   // ★ 스크롤 잠금
        });

    $(".util li")
        .eq(3)
        .click(function (e) {
            e.preventDefault();
            $(".shopping").removeClass("on");
            $("#sub01").fadeOut();
            $("#login").fadeIn();
            $("body").addClass("no-scroll");   // ★ 스크롤 잠금
        });

    // ---------------- 로그인 페이지 닫기 ----------------
    $(".loginClose").click(function (e) {
        e.preventDefault();
        $("#login").fadeOut();
        $("#wrap").fadeIn();
        $("body").removeClass("no-scroll");  // ★ 스크롤 해제
    });

    // (선택) 바깥(검은 배경) 클릭 시 닫기
    $("#login").on("click", function (e) {
        if ($(e.target).is("#login")) {
            $("#login").fadeOut();
            $("#wrap").fadeIn();
            $("body").removeClass("no-scroll"); // ★ 스크롤 해제
        }
    });

    // 서브페이지로 갈 때 혹시 잠금 풀기(안전장치)
    $(".logo, .gnb li").on("click", function () {
        $("body").removeClass("no-scroll");
    });








})