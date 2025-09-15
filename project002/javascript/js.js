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




    // 서브페이지연결하기

    $(".gnb li")
        .eq(0)
        .click(function (e) {
            e.preventDefault();
            $("#wrap").fadeOut();
            $("#sub01").fadeIn();
        });





})