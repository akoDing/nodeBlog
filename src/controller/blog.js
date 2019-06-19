const { exec } = require('../db/mysql')
const { xss } = require('xss')

const getList = (author, keyword) => {
    // 先返回假数据（格式是正确的）
    /* return [
        {
            id: 1,
            title: '标题A',
            content: '内容A',
            createTime: 1557908101890,
            author: 'xdd'
        },
        {
            id: 2,
            title: '标题B',
            content: '内容B',
            createTime: 1557908169282,
            author: 'bd'
        }
    ] */
    let sql = `select * from blogs where 1 = 1 `
    if (author) {
        sql += `and author = '${author}' `
    }
    if (keyword) {
        sql += `and title like '%${keyword}%' `
    }
    sql += `order by createtime desc;`
    // 返回的是Promise
    return exec(sql)
}

const getDetail = (id) => {
    /* return {
        id: 1,
        title: '标题A',
        content: '内容A',
        createTime: 1557908101890,
        author: 'xdd'
    } */
    let sql = `select * from blogs where id = '${id}';`
    // 返回的是Promise
    return exec(sql).then(rows => {
        return rows[0]
    })
}

const newBlog = (blogData = {}) => {
    // blogData 是一个博客对象 包含 title content author 属性
    // console.log('newblogData', blogData)

    // 防止xss攻击
    const title = xss(blogData.title)
    const content = blogData.content
    const author = blogData.author
    const createTime = Date.now()
    let sql = `insert into blogs (title, content, createTime, author) values ('${title}', '${content}', '${createTime}', '${author}');`

    return exec(sql).then(insertData => {
        // console.log('insertData is', insertData)
        return {
            id: insertData.insertId
        }
    })
}

const updataBlog = (blogData = {}) => {
    // id 就是要更新博客的id
    // blogData 是一个博客对象 包含 title content 属性
    // console.log('updataBlog', id, blogData)
    const id = blogData.id
    const title = blogData.title
    const content = blogData.content

    let sql = `update blogs set title = '${title}', content = '${content}' where id = ${id};`

    return exec(sql).then(updateData => {
        // console.log('updateData is', updateData)
        if (updateData.affectedRows > 0) {
            return true
        }
        return false
    })
}

const delBlog = (id, author) => {
    // id 就是要删除博客的id
    let sql = `delete from blogs where id = '${id}' and author = '${author}';`
    return exec(sql).then(delData => {
        if (delData.affectedRows > 0) {
            return true
        }
        return false
    })
}

module.exports = {
    getList,
    getDetail,
    newBlog,
    updataBlog,
    delBlog
}