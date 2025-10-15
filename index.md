---
layout: home
hero:
  name: CookLikeHOC
  text: 像老乡鸡那样做饭
  tagline: 文字来自《老乡鸡菜品溯源报告》，并做归纳、编辑与整理
  actions:
    - theme: brand
      text: 开始浏览
      link: /炒菜/README
    - theme: alt
      text: GitHub
      link: https://github.com/Gar-b-age/CookLikeHOC
---

<!-- markdownlint-disable MD033 -->
<div class="home-showcase">
  <div class="home-card" data-href="/炒菜/README" role="link" tabindex="0" aria-label="人气必点">
    <div class="title"><span class="emoji">🔥</span>人气必点</div>
    <div class="desc">香辣鸡丁、鱼香肉丝、宫保鸡丁，开胃下饭的明星菜。</div>
  </div>
  <div class="home-card" data-href="/主食/README" role="link" tabindex="0" aria-label="汤面招牌">
    <div class="title"><span class="emoji">🍜</span>汤面招牌</div>
    <div class="desc">肥西老母鸡汤面、香菇鸡汤面，汤浓味正，暖胃治愈。</div>
  </div>
  <div class="home-card" data-href="/凉拌/README" role="link" tabindex="0" aria-label="清爽轻食">
    <div class="title"><span class="emoji">🥗</span>清爽轻食</div>
    <div class="desc">凉拌菜系与蒸菜精选，清爽不油腻，营养均衡。</div>
  </div>
  <div class="home-card" data-href="/炒菜/README" role="link" tabindex="0" aria-label="便当盖饭">
    <div class="title"><span class="emoji">🍱</span>便当盖饭</div>
    <div class="desc">鱼香肉丝盖饭、笋子鸡丁盖饭，营养全面，省时省心。</div>
  </div>
  <div class="home-card" data-href="/早餐/README" role="link" tabindex="0" aria-label="蒸点面点">
    <div class="title"><span class="emoji">🥟</span>蒸点面点</div>
    <div class="desc">鸡汁汤包、手工烧麦、荠菜鲜肉蒸饺，鲜香多汁。</div>
  </div>
  <div class="home-card" data-href="/饮品/README" role="link" tabindex="0" aria-label="饮品小食">
    <div class="title"><span class="emoji">🍹</span>饮品小食</div>
    <div class="desc">原味豆浆、热奶茶、香脆薯饼，来点轻松的小确幸。</div>
  </div>
</div>
<!-- markdownlint-enable MD033 -->

<script>
  const cards = document.querySelectorAll('.home-card[data-href]');
  cards.forEach((card) => {
    const target = card.getAttribute('data-href');
    if (!target) return;
    const go = () => { window.location.href = target; };
    card.addEventListener('click', go);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); }
    });
  });
</script>
