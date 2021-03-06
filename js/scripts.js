const header = document.getElementById('site-header')
const overlay = document.getElementById('overlay')

function createHeaderLinks(links) {
    const ul = document.getElementById('header-links')
    const template = document.getElementById('header-link-template')

    if (template) {
        links.forEach((link) => {
            const li = document.importNode(template.content, true)
            const a = li.querySelector('a')

            a.textContent = link.label
            a.href = link.href

            if (link.target !== '') {
                a.target = link.target
            }

            link.class.forEach((c) => {
                a.classList.add(c)
            })

            ul.appendChild(li)
        })

        ul.replaceWith(ul)
    }
}

function createCaseStudies(caseStudies) {
    const container = document.getElementById('case-studies-container')
    const template = document.getElementById('case-study-template')

    if (template) {
        caseStudies.forEach((caseStudy) => {
            const item = document.importNode(template.content, true)

            item.querySelector('.case-study').href = caseStudy.href
            item.querySelector('img').src = caseStudy.image
            item.querySelector('.body strong').textContent = caseStudy.title
            item.querySelector('.body .read-more span').textContent = caseStudy.readMoreLabel

            container.appendChild(item)
        })

        container.replaceWith(container)
    }
}

function createProjects(projects) {
    const container = document.querySelector('#projects-container .slider')
    const template = document.getElementById('project-template')

    if (template) {
        projects.forEach((project) => {
            const item = document.importNode(template.content, true)

            item.querySelector('img').src = project.image
            item.querySelector('.body strong').textContent = project.title
            item.querySelector('.body p').innerHTML = project.description
            item.querySelector('.body a').href = project.href

            container.appendChild(item)
        })

        container.replaceWith(container)

        new Slideshow('#projects-container')

        function initImagePreview() {
            const elements = document.querySelectorAll('#projects-container .project')
            const preview = document.getElementById('project-preview')

            Array.from(elements).forEach((element, index) => {
                element.querySelector('img').addEventListener('click', (e) => {
                    overlay.classList.add('active', 'force')
                    preview.classList.add('active')

                    preview.querySelector('strong').textContent = projects[index].title
                    preview.querySelector('img').src = projects[index].image

                    element.addEventListener('mousemove', (e) => {
                        console.log('dragenter')
                    })
                })
            })

            document.getElementById('close-preview').addEventListener('click', (e) => {
                header.classList.remove('active')
                overlay.classList.remove('active', 'force')
                document.getElementById('project-preview').classList.remove('active')
            })
        }

        initImagePreview()
    }
}

function mobileMenu() {
    document.getElementById('mobile-menu').addEventListener('click', () => {
        if (header.classList.contains('active')) {
            header.classList.remove('active')
            overlay.classList.remove('active')
        }
        else {
            header.classList.add('active')
            overlay.classList.add('active')
        }
    })
}

function initOverlay() {
    const projectPreview = document.getElementById('project-preview')

    document.getElementById('overlay').addEventListener('click', () => {
        header.classList.remove('active')
        overlay.classList.remove('active', 'force')
        projectPreview.classList.remove('active')
    })
}

function responsiveTools() {
    if (document.getElementById('projects-container')) {
        window.removeEventListener('resize', resize)
        window.addEventListener('resize', resize)

        function resize() {
            setTimeout(() => {
                const width = document.querySelector('#projects-container .project:first-child .media img').offsetHeight

                document.documentElement.style.setProperty('--project-height', width + 'px')
            }, 100)
        }

        resize()
    }
}

function Slideshow(element) {
    this.el = document.querySelector(element)
    this.init()
}

Slideshow.prototype = {
    init: function () {
        this.wrapper = this.el.querySelector('.slider')
        this.slides = this.el.querySelectorAll('.slide')
        this.previous = this.el.querySelector('.prev')
        this.next = this.el.querySelector('.next')
        this.currentPage = this.el.querySelector('#current-page')
        this.totalPages = this.el.querySelector('#total-pages')
        this.index = 0
        this.total = this.slides.length

        this.actions()
    },

    _slideTo: function (slide) {
        const currentSlide = this.slides[slide]
        currentSlide.classList.add('active')

        this.currentPage.textContent = slide + 1

        for (let i = 0; i < this.slides.length; i++) {
            let slide = this.slides[i]

            if (slide !== currentSlide) {
                slide.classList.remove('active')
            }
        }
    },

    actions: function () {
        const self = this

        this.slides[0].classList.add('active')
        this.currentPage.textContent = 1
        this.totalPages.textContent = this.slides.length

        self.next.addEventListener('click', function () {
            self.index++
            self.next.classList.remove('disabled')
            self.previous.classList.remove('disabled')

            if (self.index === self.total - 1) {
                self.index = self.total - 1
                self.next.classList.add('disabled')
            }

            self._slideTo(self.index)

        }, false)

        self.previous.addEventListener('click', function () {
            self.index--
            self.previous.classList.remove('disabled')
            self.next.classList.remove('disabled')

            if (self.index === 0) {
                self.index = 0
                self.previous.classList.add('disabled')
            }

            self._slideTo(self.index)

        }, false)
    }
}

window.addEventListener('DOMContentLoaded', () => {
    createHeaderLinks(headerLinks)
    createCaseStudies(caseStudies)
    createProjects(projects)
    mobileMenu()
    responsiveTools()
    initOverlay()
}, false)
