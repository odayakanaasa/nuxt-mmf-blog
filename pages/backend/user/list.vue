<template>
    <div class="settings-main card">
        <div class="settings-main-content">
            <div class="list-section list-header">
                <div class="list-username">用户名</div>
                <div class="list-email">邮箱</div>
                <div class="list-date">时间</div>
                <div class="list-action">操作</div>
            </div>
            <div v-for="item in user.data" :key="item._id" class="list-section">
                <div class="list-username">{{ item.username }}</div>
                <div class="list-email">{{ item.email }}</div>
                <div class="list-date">{{ item.update_date | timeYmd }}</div>
                <div class="list-action">
                    <router-link :to="'/backend/user/modify/' + item._id" class="badge badge-success">编辑</router-link> •
                    <a v-if="item.is_delete" @click="recover(item._id)" href="javascript:;">恢复</a>
                    <a v-else @click="deletes(item._id)" href="javascript:;">删除</a>
                </div>
            </div>
        </div>
        <div v-if="user.hasNext" class="settings-footer clearfix">
            <a @click="loadMore()" class="admin-load-more" href="javascript:;">加载更多</a>
        </div>
    </div>
</template>

<script lang="babel">
import { mapGetters } from 'vuex'
import api from '~api'

export default {
    name: 'backend-user-list',
    middleware: 'admin',
    async asyncData({store, route}, config = { page: 1 }) {
        await store.dispatch('backend/user/getUserList', {
            ...config,
            path: route.path
        })
    },
    computed: {
        ...mapGetters({
            user: 'backend/user/getUserList'
        })
    },
    methods: {
        loadMore(page = this.user.page + 1) {
            this.$options.asyncData({store: this.$store, route: this.$route}, {page})
        },
        async recover(id) {
            const { data: { code, message} } = await api.get('backend/user/recover', { id })
            if (code === 200) {
                this.$store.dispatch('global/showMsg', {
                    type: 'success',
                    content: message
                })
                this.$store.commit('backend/user/recoverUser', id)
            }
        },
        async deletes(id) {
            const { data: { code, message} } = await api.get('backend/user/delete', { id })
            if (code === 200) {
                this.$store.dispatch('global/showMsg', {
                    type: 'success',
                    content: message
                })
                this.$store.commit('backend/user/deleteUser', id)
            }
        }
    },
    mounted() {

    },
    head() {
        return {
            title: '用户列表 - M.M.F 小屋',
            meta: [{ vmid: 'description', name: 'description', content: 'M.M.F 小屋' }]
        }
    }
}
</script>
