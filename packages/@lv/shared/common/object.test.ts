import { expect } from 'chai'
import { describe } from 'mocha'
import {
  getDeepVal,
  setDeepVal,
  mixin,
  genObjectSchema,
  filterObject,
  pick,
  isObject,
} from './object'

describe('Object', function () {
  describe('#getDeepVal', function () {
    it('use path code can get val from object', function () {
      const source = {
        a: {
          g: {
            h: [1, 2, 3],
            j: 'def',
          },
        },
        b: {
          d: 'abc',
          e: {
            f: 456,
          },
        },
        c: 123,
      }

      expect(getDeepVal(source, 'a.g')).to.be.a('object').to.equal(source.a.g)
      expect(getDeepVal(source, 'a.g.h')).to.be.equal(source.a.g.h)
      expect(getDeepVal(source, 'b.e')).to.equal(source.b.e)
      expect(getDeepVal(source, 'c')).to.equal(source.c)
    })

    it('when target is null,undefined,NaN, return null', function () {
      const source = { a: null, b: { c: undefined, d: NaN } }
      expect(getDeepVal(source, 'a')).to.equal(null)
      expect(getDeepVal(source, 'b.c')).to.equal(null)
      expect(getDeepVal(source, 'b.d')).to.equal(null)
      expect(getDeepVal(source, 'c.d.e')).to.equal(null)
    })
  })

  describe('#setDeepVal', function () {
    it('Modify a value in a object', function () {
      const o = { a: 1, b: { c: { d: '123' } } }
      setDeepVal(o, 'b.c.d', 'abc')
      expect(getDeepVal(o, 'b.c.d')).to.equal('abc')
    })

    it('Set a value in every every deeply', function () {
      const o = {}
      setDeepVal(o, 'a.b.c.d.f.e', 123)
      expect(getDeepVal(o, 'a.b.c.d.f.e')).to.equal(123)
    })
  })

  describe('#mixin', function () {
    it('general test: a update object mixin to target', function () {
      const update = {
        a: { b: 123, c: { d: 'abc', e: [123], f: 'abc' } },
        b: 123,
        e: '123',
      }
      const target = { e: 'abc' }

      expect(mixin(update, target)).to.deep.equal({
        a: { b: 123, c: { d: 'abc', e: [123], f: 'abc' } },
        b: 123,
        e: '123',
      })
    })

    it('update mode', function () {
      const update = {
        f: 'fff',
      }
      const target = {
        a: [123],
        b: 123,
        e: 'abc',
      }
      expect(mixin(update, target, true)).to.deep.equal(target)
    })
  })

  describe('#genObjectSchema', function () {
    it('generate a object schema', function () {
      const code = 'a,c.d,.e,.f.h,g'
      const exp = {
        a: 'a',
        c: {
          d: 'd',
          e: 'e',
          f: {
            h: 'h',
          },
        },
        g: 'g',
      }
      expect(genObjectSchema(code)).to.deep.equal(exp)
    })
  })

  describe('#filterObject', function () {
    it('general', function () {
      const source = {
        a: 123,
        b: {
          c: {
            d: 'abc',
            e: 123,
            f: {
              // get a object
              g: { j: 1 },
            },
          },
        },
        h: [123],
      }

      const code = 'b.c.d,..e,..f,h'
      expect(filterObject(source, code)).to.deep.equal({
        b: { c: { d: 'abc', e: 123, f: { g: { j: 1 } } } },
        h: [123],
      })
    })

    it('real environment', function () {
      const source = {
        id: 301097966,
        node_id: 'MDEwOlJlcG9zaXRvcnkzMDEwOTc5NjY=',
        name: 'Anlinux-Resources',
        full_name: 'istomyang/Anlinux-Resources',
        private: false,
        owner: {
          login: 'istomyang',
          id: 67993732,
          node_id: 'MDQ6VXNlcjY3OTkzNzMy',
          avatar_url: 'https://avatars.githubusercontent.com/u/67993732?v=4',
          gravatar_id: '',
          url: 'https://api.github.com/users/istomyang',
          html_url: 'https://github.com/istomyang',
          followers_url: 'https://api.github.com/users/istomyang/followers',
          following_url:
            'https://api.github.com/users/istomyang/following{/other_user}',
          gists_url: 'https://api.github.com/users/istomyang/gists{/gist_id}',
          starred_url:
            'https://api.github.com/users/istomyang/starred{/owner}{/repo}',
          subscriptions_url:
            'https://api.github.com/users/istomyang/subscriptions',
          organizations_url: 'https://api.github.com/users/istomyang/orgs',
          repos_url: 'https://api.github.com/users/istomyang/repos',
          events_url: 'https://api.github.com/users/istomyang/events{/privacy}',
          received_events_url:
            'https://api.github.com/users/istomyang/received_events',
          type: 'User',
          site_admin: false,
        },
        html_url: 'https://github.com/istomyang/Anlinux-Resources',
        description: 'Scripts, Rootfs and other content for AnLinux',
        fork: true,
        url: 'https://api.github.com/repos/istomyang/Anlinux-Resources',
        forks_url:
          'https://api.github.com/repos/istomyang/Anlinux-Resources/forks',
        keys_url:
          'https://api.github.com/repos/istomyang/Anlinux-Resources/keys{/key_id}',
        collaborators_url:
          'https://api.github.com/repos/istomyang/Anlinux-Resources/collaborators{/collaborator}',
        teams_url:
          'https://api.github.com/repos/istomyang/Anlinux-Resources/teams',
        hooks_url:
          'https://api.github.com/repos/istomyang/Anlinux-Resources/hooks',
        issue_events_url:
          'https://api.github.com/repos/istomyang/Anlinux-Resources/issues/events{/number}',
        events_url:
          'https://api.github.com/repos/istomyang/Anlinux-Resources/events',
        assignees_url:
          'https://api.github.com/repos/istomyang/Anlinux-Resources/assignees{/user}',
        branches_url:
          'https://api.github.com/repos/istomyang/Anlinux-Resources/branches{/branch}',
        tags_url:
          'https://api.github.com/repos/istomyang/Anlinux-Resources/tags',
        blobs_url:
          'https://api.github.com/repos/istomyang/Anlinux-Resources/git/blobs{/sha}',
        git_tags_url:
          'https://api.github.com/repos/istomyang/Anlinux-Resources/git/tags{/sha}',
        git_refs_url:
          'https://api.github.com/repos/istomyang/Anlinux-Resources/git/refs{/sha}',
        trees_url:
          'https://api.github.com/repos/istomyang/Anlinux-Resources/git/trees{/sha}',
        statuses_url:
          'https://api.github.com/repos/istomyang/Anlinux-Resources/statuses/{sha}',
        languages_url:
          'https://api.github.com/repos/istomyang/Anlinux-Resources/languages',
        stargazers_url:
          'https://api.github.com/repos/istomyang/Anlinux-Resources/stargazers',
        contributors_url:
          'https://api.github.com/repos/istomyang/Anlinux-Resources/contributors',
        subscribers_url:
          'https://api.github.com/repos/istomyang/Anlinux-Resources/subscribers',
        subscription_url:
          'https://api.github.com/repos/istomyang/Anlinux-Resources/subscription',
        commits_url:
          'https://api.github.com/repos/istomyang/Anlinux-Resources/commits{/sha}',
        git_commits_url:
          'https://api.github.com/repos/istomyang/Anlinux-Resources/git/commits{/sha}',
        comments_url:
          'https://api.github.com/repos/istomyang/Anlinux-Resources/comments{/number}',
        issue_comment_url:
          'https://api.github.com/repos/istomyang/Anlinux-Resources/issues/comments{/number}',
        contents_url:
          'https://api.github.com/repos/istomyang/Anlinux-Resources/contents/{+path}',
        compare_url:
          'https://api.github.com/repos/istomyang/Anlinux-Resources/compare/{base}...{head}',
        merges_url:
          'https://api.github.com/repos/istomyang/Anlinux-Resources/merges',
        archive_url:
          'https://api.github.com/repos/istomyang/Anlinux-Resources/{archive_format}{/ref}',
        downloads_url:
          'https://api.github.com/repos/istomyang/Anlinux-Resources/downloads',
        issues_url:
          'https://api.github.com/repos/istomyang/Anlinux-Resources/issues{/number}',
        pulls_url:
          'https://api.github.com/repos/istomyang/Anlinux-Resources/pulls{/number}',
        milestones_url:
          'https://api.github.com/repos/istomyang/Anlinux-Resources/milestones{/number}',
        notifications_url:
          'https://api.github.com/repos/istomyang/Anlinux-Resources/notifications{?since,all,participating}',
        labels_url:
          'https://api.github.com/repos/istomyang/Anlinux-Resources/labels{/name}',
        releases_url:
          'https://api.github.com/repos/istomyang/Anlinux-Resources/releases{/id}',
        deployments_url:
          'https://api.github.com/repos/istomyang/Anlinux-Resources/deployments',
        created_at: '2020-10-04T10:15:54Z',
        updated_at: '2020-10-04T10:15:55Z',
        pushed_at: '2020-09-29T06:02:15Z',
        git_url: 'git://github.com/istomyang/Anlinux-Resources.git',
        ssh_url: 'git@github.com:istomyang/Anlinux-Resources.git',
        clone_url: 'https://github.com/istomyang/Anlinux-Resources.git',
        svn_url: 'https://github.com/istomyang/Anlinux-Resources',
        homepage: '',
        size: 4613037,
        stargazers_count: 0,
        watchers_count: 0,
        language: null,
        has_issues: false,
        has_projects: true,
        has_downloads: true,
        has_wiki: false,
        has_pages: false,
        forks_count: 0,
        mirror_url: null,
        archived: false,
        disabled: false,
        open_issues_count: 0,
        license: {
          key: 'gpl-2.0',
          name: 'GNU General Public License v2.0',
          spdx_id: 'GPL-2.0',
          url: 'https://api.github.com/licenses/gpl-2.0',
          node_id: 'MDc6TGljZW5zZTg=',
        },
        forks: 0,
        open_issues: 0,
        watchers: 0,
        default_branch: 'master',
      }
      const code = 'full_name,owner.login,private,license.spdx_id'
      // noinspection SpellCheckingInspection
      expect(filterObject(source, code)).to.deep.equal({
        full_name: 'istomyang/Anlinux-Resources',
        owner: {
          login: 'istomyang',
        },
        private: false,
        license: {
          spdx_id: 'GPL-2.0',
        },
      })
    })
  })

  describe('#pick', function () {
    it('general', function () {
      const source = {
        a: 123,
        b: {
          c: {
            d: 'abc',
            e: 123,
            f: {
              // get a object
              g: { j: 1 },
            },
          },
        },
        h: [123],
      }

      const variable = {
        $0: 'b.c',
      }

      const schema = {
        s1: '$0.d',
        s2: () => ['$0.e', (val: number) => val + 1000],
        s3: ['a', 'h', '$0.d'],
      }

      expect(pick(source, schema, variable)).to.deep.equal({
        s1: 'abc',
        s2: 1123,
        s3: [123, [123], 'abc'],
      })
    })
  })
})
